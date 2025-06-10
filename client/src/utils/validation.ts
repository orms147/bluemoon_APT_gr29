// Validation utilities for form inputs

export const ValidationRules = {
  // Họ tên: chỉ cho phép chữ cái, khoảng trắng và một số ký tự tiếng Việt
  fullName: {
    pattern:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/,
    message: "Họ tên chỉ được chứa chữ cái và khoảng trắng",
  },

  // CCCD: chỉ cho phép số, 12 ký tự
  cccd: {
    pattern: /^\d{12}$/,
    message: "CCCD phải là 12 chữ số",
  },

  // Số điện thoại: 10-11 số, bắt đầu bằng 0
  phone: {
    pattern: /^0\d{9,10}$/,
    message: "Số điện thoại phải có 10-11 chữ số và bắt đầu bằng 0",
  },

  // Biển số xe: cho phép chữ, số và dấu gạch ngang
  licensePlate: {
    pattern: /^[0-9A-Z\-.]+$/,
    message: "Biển số xe chỉ được chứa chữ cái in hoa, số và dấu gạch ngang",
  },

  // Mã (mã nhân khẩu, mã hộ khẩu, etc): chỉ chữ và số
  code: {
    pattern: /^[A-Za-z0-9]+$/,
    message: "Mã chỉ được chứa chữ cái và số",
  },

  // Địa chỉ: cho phép chữ, số, khoảng trắng và một số ký tự đặc biệt
  address: {
    pattern:
      /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s,./-]+$/,
    message: "Địa chỉ chứa ký tự không hợp lệ",
  },

  // Email
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Email không đúng định dạng",
  },
}

export const validateField = (value: string, rule: { pattern: RegExp; message: string }): string | null => {
  if (!value.trim()) return null // Không validate nếu trống
  return rule.pattern.test(value.trim()) ? null : rule.message
}

export const validateRequired = (value: string, fieldName: string): string | null => {
  return value.trim() ? null : `${fieldName} là bắt buộc`
}

// Hàm validate tổng hợp
export const validateForm = (data: Record<string, any>, rules: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {}

  Object.keys(rules).forEach((field) => {
    const value = data[field]
    const rule = rules[field]

    if (rule.required) {
      const requiredError = validateRequired(value, rule.label || field)
      if (requiredError) {
        errors[field] = requiredError
        return
      }
    }

    if (rule.validation && value) {
      const validationError = validateField(value, rule.validation)
      if (validationError) {
        errors[field] = validationError
      }
    }
  })

  return errors
}
