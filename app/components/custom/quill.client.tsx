import type { ComponentProps } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type ReactQuillProps = ComponentProps<typeof ReactQuill>;
type Props = Pick<ReactQuillProps, "onChange" | "placeholder" | "theme" | "value"> & {
    modulesConfig?: string[];
};

const allModules = {
    toolbar: [
        [{ font: [] }], // Font selection
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header sizes
        [{ size: [] }], // Font size
        ["bold", "italic", "underline", "strike"], // Formatting
        [{ script: "sub" }, { script: "super" }], // Subscript / Superscript
        ["blockquote", "code-block"], // Blockquote & Code Block
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ], // Lists & Indentation
        [{ direction: "rtl" }], // Text direction
        [{ align: [] }], // Text alignment
        [{ color: [] }, { background: [] }], // Color picker
        ["link", "image", "video", "formula"], // Media and formulas
        ["clean"], // Remove formatting
    ],
};

const moduleMapping: Record<string, any> = {
    "font-selection": [{ font: [] }],
    "headers": [{ header: [1, 2, 3, 4, 5, 6, false] }],
    "size": [{ size: [] }],
    "formatting": ["bold", "italic", "underline", "strike"],
    "subscript-superscript": [{ script: "sub" }, { script: "super" }],
    "blockquote-code": ["blockquote", "code-block"],
    "lists-indentation": [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
    ],
    "text-direction": [{ direction: "rtl" }],
    "text-alignment": [{ align: [] }],
    "color-picker": [{ color: [] }, { background: [] }],
    "media-formulas": ["link", "image", "video", "formula"],
    "remove-formatting": ["clean"],
};

export function TextEditor({ modulesConfig, ...props }: Props) {
    const modules = {
        toolbar: modulesConfig
            ? modulesConfig.flatMap((key) => moduleMapping[key] || [])
            : allModules.toolbar,
    };

    return <ReactQuill {...props} modules={modules} />;
}
