import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';

const port = 5173;
const host = '127.0.0.1';
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const electronCmd = path.join(
	process.cwd(),
	'node_modules',
	'.bin',
	isWin ? 'electron.cmd' : 'electron'
);

let shuttingDown = false;
let viteProcess;
let electronProcess;

function waitForPort(targetHost, targetPort, timeoutMs = 30000) {
	const start = Date.now();

	return new Promise((resolve, reject) => {
		const tryConnect = () => {
			const socket = new net.Socket();

			socket
				.once('connect', () => {
					socket.destroy();
					resolve();
				})
				.once('error', () => {
					socket.destroy();
					if (Date.now() - start >= timeoutMs) {
						reject(
							new Error(
								`Timed out waiting for Vite at http://${targetHost}:${targetPort}/`
							)
						);
						return;
					}
					setTimeout(tryConnect, 300);
				})
				.connect(targetPort, targetHost);
		};

		tryConnect();
	});
}

function killChild(child) {
	if (!child || child.killed) return;
	child.kill('SIGTERM');
}

function shutdown(code = 0) {
	if (shuttingDown) return;
	shuttingDown = true;
	killChild(electronProcess);
	killChild(viteProcess);
	setTimeout(() => process.exit(code), 100);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('exit', () => {
	killChild(electronProcess);
	killChild(viteProcess);
});

viteProcess = spawn(
	npmCmd,
	['run', 'dev:web', '--', '--host', host, '--strictPort'],
	{
		stdio: 'inherit',
		env: process.env,
	}
);

viteProcess.on('exit', (code) => {
	if (!shuttingDown) {
		console.error(`Vite exited early with code ${code ?? 1}.`);
		shutdown(code ?? 1);
	}
});

try {
	await waitForPort(host, port);
	electronProcess = spawn(electronCmd, ['.'], {
		stdio: 'inherit',
		env: { ...process.env, NODE_ENV: 'development' },
	});

	electronProcess.on('exit', (code) => {
		shutdown(code ?? 0);
	});
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	shutdown(1);
}
