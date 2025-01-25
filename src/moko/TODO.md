## Todo List

## BUG

-   如果在其他 app 上更改了文件，则无法实时更新现实到编辑器，必须重新开关。
-   输入法飘移 electron 问题 https://github.com/electron/electron/issues/4539 IEM

### DOING

-   切换页面后 auto focus
-   页面选择后如果 tab 呗遮挡 自动移动
-   FileManager save

### TODO

-   LayoutManager https://golden-layout.com/docs/Config.html
-   setting
-   flow note card && scan // napkin ideas

-   大纲视图
-   弹性滑动 <https://github.com/filamentgroup/Overthrow?tab=readme-ov-file>
-   设置
-   保存文件功能
-   加载 Register 注册表包括 commands ViewRegistry ToolBarItemRegistry //未来可以优化为一个

## DONE

-   切换文件 tab
-   恢复历史状态(通过 fromJson 实现)
-   change codemirror6
-   electron Api 整理 1111
-   filepanel focus collaspeAll expendAll 1110
-   filepanel css style improve 1110
-   HotkeyManager 1104
-   commands 1104
-   FileManager r w m
-   在 workspace 为空时 点击文件则打开新 pane 以及 pane 缓存 1028
-   可以使用对应视图打开文件 制作 view 缓存池子 打开文件后 然后选择合适的 view 放入信息 File 文件 在 Pane 中实现打开
-   如果关闭全部文件，则显示空白页 split 目前在 workspace.js
-   目前已经完成视图注册 注册了 EditorView 下一步就是新建标签页 调用视图！
-   fsadapter ! 1021
-   vibrancy macos
-   setting view 基础功能添加 - 1012
-   TabGroup 实现
-   添加 splitview 水印
-   SplitView
-   EditorView
-   ImageView
-   WelcomeView
-   Pane
-   标签页
-   tabs 逻辑放置在 Pane 中
-   FS
-   文件匹配与忽略选项
