// THIS FILE IS ONLY FOR IDE ENTRY CHECKING NOT FOR REAL USAGE

import QnrRadio from '@admin/components/question/Radio.vue'
import QnrCheckbox from '@admin/components/question/Checkbox.vue'
import QnrMatrixRadio from '@admin/components/question/MatrixRadio.vue'
import QnrPicker from '@admin/components/question/Picker.vue'
import QnrFillblank from '@admin/components/question/Fillblank.vue'
export const questionManager = {
  "radio": {
    "title": "单选题",
    "type": "radio",
    "choice": [{
      "content": "选项1"
    }, {
      "content": "选项2"
    }, {
      "content": "选项3"
    }, {
      "content": "选项4"
    }]
  },
  "checkbox": {
    "title": "多选题",
    "type": "checkbox",
    "choice": [{
      "content": "选项1"
    }, {
      "content": "选项2"
    }, {
      "content": "选项3"
    }, {
      "content": "选项4"
    }]
  },
  "matrix-radio": {
    "title": "矩阵题",
    "type": "matrix-radio",
    "choice": [{
      "content": "选项1"
    }, {
      "content": "选项2"
    }],
    "subquestion": [{
      "content": "问题1"
    }, {
      "content": "问题2"
    }]
  },
  "picker": {
    "title": "下拉题",
    "type": "picker",
    "defaultSelectedValue": [""],
    "list": [["选项1", "选项2"]]
  },
  "fillblank": {
    "title": "填空题",
    "type": "fillblank",
    "content": "两条下划线<span id=\"blank-0\" class=\"blank\">__</span>相当于一个填空",
    "blank": ["blank-0"]
  }
}

export {
  QnrRadio,
  QnrCheckbox,
  QnrMatrixRadio,
  QnrPicker,
  QnrFillblank,
}
