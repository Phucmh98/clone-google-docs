import { Extension } from "@tiptap/react";
import "@tiptap/extension-text-style";

// Khai báo module mở rộng cho "@tiptap/core" để thêm các lệnh mới liên quan đến lineHeight
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        lineHeight: {
            setLineHeight: (lineHeight: string) => ReturnType; // Lệnh để thiết lập khoảng cách dòng
            unsetLineHeight: () => ReturnType; // Lệnh để xóa khoảng cách dòng
        };
    }
}

/**
 * Extension `LineHeightExtensions` được sử dụng để thêm hoặc chỉnh sửa thuộc tính `lineHeight` 
 * cho các node hoặc mark trong tài liệu. Extension này cung cấp các tùy chọn, thuộc tính toàn cục, 
 * và các lệnh để quản lý khoảng cách dòng (line-height).
 */
export const LineHeightExtensions = Extension.create({
    name: "lineHeight", // Tên của extension
    addOptions() {
        return {
            types: ['heading', 'paragraph'], // Xác định các loại node/mark mà extension này áp dụng
            defaultLineHeight: "normal" // Giá trị mặc định của khoảng cách dòng
        }
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types, // Áp dụng thuộc tính cho các loại node/mark được chỉ định
                attributes: {
                    lineHeight: {
                        default: this.options.defaultLineHeight, // Giá trị mặc định của thuộc tính lineHeight
                        renderHTML: (attributes) => {
                            // Hàm renderHTML để chuyển đổi thuộc tính lineHeight thành CSS
                            if (!attributes.lineHeight) return {};
                            return {
                                style: `line-height: ${attributes.lineHeight}`,
                            };
                        },
                        parseHTML: (element) => {
                            // Hàm parseHTML để lấy giá trị lineHeight từ HTML
                            return element.style.lineHeight || this.options.defaultLineHeight;
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            // Lệnh để thiết lập khoảng cách dòng
            setLineHeight: (lineHeight: string) => ({ tr, state, dispatch }) => {
                const { selection } = state; // Lấy thông tin vùng chọn hiện tại
                tr = tr.setSelection(selection); // Đặt lại vùng chọn
                const { from, to } = selection; // Lấy vị trí bắt đầu và kết thúc của vùng chọn

                // Duyệt qua các node trong vùng chọn
                state.doc.nodesBetween(from, to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        // Nếu node thuộc loại được hỗ trợ, cập nhật thuộc tính lineHeight
                        tr = tr.setNodeMarkup(pos, undefined,
                            {
                                ...node.attrs,
                                lineHeight
                            }
                        );
                    }
                })
                if (dispatch) dispatch(tr); // Gửi transaction nếu có dispatch
                return true; // Trả về true để xác nhận lệnh đã được thực thi
            },
            // Lệnh để xóa khoảng cách dòng (trả về giá trị mặc định)
            unsetLineHeight: () => ({ tr, state, dispatch }) => {
                const { selection } = state; // Lấy thông tin vùng chọn hiện tại
                tr = tr.setSelection(selection); // Đặt lại vùng chọn

                const { from, to } = selection; // Lấy vị trí bắt đầu và kết thúc của vùng chọn
                // Duyệt qua các node trong vùng chọn
                state.doc.nodesBetween(from, to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        // Nếu node thuộc loại được hỗ trợ, đặt lại lineHeight về giá trị mặc định
                        tr = tr.setNodeMarkup(pos, undefined, {
                            ...node.attrs,
                            lineHeight: this.options.defaultLineHeight
                        })
                    }
                })
                if (dispatch) dispatch(tr); // Gửi transaction nếu có dispatch
                return true; // Trả về true để xác nhận lệnh đã được thực thi
            }
        }
    }

})
