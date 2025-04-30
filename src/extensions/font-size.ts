import { Extension } from "@tiptap/react";
import "@tiptap/extension-text-style";

// Khai báo module mở rộng cho "@tiptap/core" để thêm các lệnh mới liên quan đến fontSize
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: string) => ReturnType; // Lệnh để thiết lập kích thước font
            unsetFontSize: () => ReturnType; // Lệnh để xóa kích thước font
        };
    }
}

// Tạo một extension mới để hỗ trợ fontSize
export const FontSizeExtensions = Extension.create({
    name: "fontSize", // Tên của extension
    addOptions() {
        return {
            types: ["textStyle"], // Xác định các loại node/mark mà extension này áp dụng
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types, // Áp dụng thuộc tính cho các loại được chỉ định
                attributes: {
                    fontSize: {
                        default: null, // Giá trị mặc định là null
                        parseHTML: (element) => element.style.fontSize, // Lấy giá trị font-size từ HTML
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {}; // Nếu không có fontSize, không thêm style
                            }

                            return {
                                style: `font-size: ${attributes.fontSize}`, // Thêm style font-size vào HTML
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            // Lệnh để thiết lập kích thước font
            setFontSize:
                (fontSize: string) =>
                    ({ chain }) => {
                        return chain().setMark("textStyle", { fontSize }).run(); // Thêm mark "textStyle" với fontSize
                    },
            // Lệnh để xóa kích thước font
            unsetFontSize:
                () =>
                    ({ chain }) => {
                        return chain()
                            .setMark("textStyle", { fontSize: null }) // Đặt fontSize về null
                            .removeEmptyTextStyle() // Xóa các textStyle rỗng
                            .run();
                    },
        };
    },
});