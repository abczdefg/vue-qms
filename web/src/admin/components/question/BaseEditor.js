import { deepCopy } from '@/utils';
export default {
  props: ['data'],
  created() {
    const { mode, type } = this.data;
    this.defaultValue = require(`@admin/components/question/${type}/default.js`).default;
    if(mode === 'add') {
      this.editorData = this.defaultValue;
    } else {
      this.editorData = deepCopy(this.data);
    }
  },
  data() {
    return {
      editorData: {},
      formName: 'editorData'
    }
  },
  methods: {
    validate() {
      return this.$refs[this.formName].validate();
    },
    getData() {
      return this.validate()
        .then(valid => Promise.resolve(this.editorData))
        .catch(err => Promise.reject('Validate error.'))
    }
  }
};
