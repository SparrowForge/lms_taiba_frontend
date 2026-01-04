"use client"

import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    UndoOutlined,
    RedoOutlined,
    ClearOutlined,
} from "@ant-design/icons"
import { $generateHtmlFromNodes } from "@lexical/html"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { Button, Space, Divider, Select,  } from "antd"
import {
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    EditorState,
} from "lexical"


const { Option } = Select



function Toolbar() {
    const [editor] = useLexicalComposerContext()

    return (
        <Space wrap style={{ padding: 8 }}>
            {/* Text styles */}
            <Button icon={<BoldOutlined />} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} />
            <Button icon={<ItalicOutlined />} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} />
            <Button icon={<UnderlineOutlined />} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} />
            <Button icon={<StrikethroughOutlined />} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")} />

            <Divider type="vertical" />

            {/* Headings */}
            <Select
                size="small"
                defaultValue="normal"
                style={{ width: 120 }}
                onChange={(value) => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value)
                }}
            >
                <Option value="paragraph">Normal</Option>
                <Option value="h1">Heading 1</Option>
                <Option value="h2">Heading 2</Option>
            </Select>

            <Divider type="vertical" />

            {/* Lists */}
            <Button icon={<OrderedListOutlined />} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "ordered-list")} />
            <Button icon={<UnorderedListOutlined />} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "unordered-list")} />

            <Divider type="vertical" />

            {/* Alignment */}
            <Button icon={<AlignLeftOutlined />} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")} />
            <Button icon={<AlignCenterOutlined />} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")} />
            <Button icon={<AlignRightOutlined />} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")} />

            <Divider type="vertical" />

            {/* Undo / Redo */}
            <Button icon={<UndoOutlined />} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} />
            <Button icon={<RedoOutlined />} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} />

            <Divider type="vertical" />

            {/* Clear */}
            <Button icon={<ClearOutlined />} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "removeFormat")} />
        </Space>
    )
}



interface LexicalEditorProps {
    value?: string
    onChange?: (html: string) => void
    placeholder?: string
    readOnly?: boolean
    height?: number
}

export default function LexicalEditor({
    onChange,
    placeholder = "Write here...",
    readOnly = false,
    height = 220,
}: LexicalEditorProps) {
    const initialConfig = {
        namespace: "LexicalEditor",
        editable: !readOnly,
        onError(error: Error) {
            console.error(error)
        },
    }

    const handleChange = (editorState: EditorState, editor: any) => {
        editorState.read(() => {
            const html = $generateHtmlFromNodes(editor)
            onChange?.(html)
        })
    }

    return (
        <div style={{ border: "1px solid #d9d9d9", borderRadius: 6 }}>
            <LexicalComposer initialConfig={initialConfig}>
                {!readOnly && <Toolbar />}

                <RichTextPlugin
                    contentEditable={<ContentEditable
                        style={{
                            minHeight: height,
                            padding: 12,
                            outline: "none",
                        }} />} ErrorBoundary={undefined}
                />

                <HistoryPlugin />
                <OnChangePlugin onChange={handleChange} />
            </LexicalComposer>
        </div>
    )
}
