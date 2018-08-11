<template>
  <div class="random-table-container">
    <table class="random-table">
      <tr class="random-row" v-for="(row, i) in tableData">
        <template v-for="(col, j) in row">
          <el-tooltip effect="dark" :content="col.title" placement="top">
            <td class="random-cell" @click="toggleSelect(i, j)" :class="cellClass(i, j)" :style="{width:100/column+'%'}">
                <span>{{i * column + j + 1}}</span>
            </td>
          </el-tooltip>
        </template>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    props: {
      options: {
        type: Array,
        required: true,
        default: () => []
      },
      value: {
        type: Array,
        required: true,
        default: () => []
      },
      column: {
        type: Number,
        default: 8
      }
    },
    computed: {
      tableData() {
        let arr = [];
        let options = this.options;
        let total = options.length;
        let column = this.column;
        let row = Math.ceil(total / column);
        for(let i = 0; i < row; i++) {
          arr[i] = [];
          for(let j = 0; j < column && i * column + j < total; j++) {
            const index = i * column + j;
            const item = options[index];
            arr[i].push({
              title: item.title,
              selected: !!this.currentValue[index]
            });
          }
        }
        return arr;
      }
    },
    data() {
      return {
        currentValue: this.convert(this.value),
        startIndex: false,
        vvv: []
      }
    },
    watch: {
      value(newVal, oldVal) {
        if(JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.currentValue = this.convert(newVal);
        }
      },
      currentValue(newVal, oldVal) {
        // 变异（非替换）数组时，newVal === oldVal
        if(JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          const randomList = this.serialize(newVal);
          this.$emit('change', randomList);
          this.$emit('input', randomList);
        }
      }
    },
    methods: {
      cellClass(i ,j) {
        const index = i * this.column + j;
        const item = this.tableData[i][j];
        const currentValue = this.currentValue;
        return {
          selected: this.startIndex === index,
          start: currentValue[index] === 'start',
          middle: currentValue[index] === true,
          end: currentValue[index] === 'end'
        }
      },
      toggleSelect(i, j) {
        const index = i * this.column + j;
        if(this.startIndex === false) {
          this.startRange(index);
          this.startIndex = index;
        } else {
          this.endRange(index);
          this.startIndex = false;
        }
      },
      startRange(index) {
        let currentValue = [...this.currentValue];
        let start = index;
        let end = index;
        let resetLeft = () => {
          for(start = index - 1; start >= 0; start--) {
            const value = currentValue[start];
            currentValue[start] = false;
            if(value === 'start') {
              break;
            }
          }
        };
        let resetRight = () => {
          for(end = index + 1; end < currentValue.length; end++) {
            const value = currentValue[end];
            currentValue[end] = false;
            if(value === 'end') {
              break;
            }
          }
        };
        if(currentValue[index] !== false) {
          switch (currentValue[index]) {
            case 'start':
              resetRight();
              break;
            case true:
              resetLeft();
              resetRight();
              break;
            case 'end':
              resetLeft();
              break;
            default:
              break;
          }
        }
        currentValue[index] = false;
        this.currentValue = currentValue;
      },
      endRange(index) {
        let currentValue = [...this.currentValue];
        let start = this.startIndex;
        let end = index;
        // 同一格，取消选中
        if(start === end) {
          currentValue[start] = false;
          this.currentValue = currentValue;
          return;
        }
        // 保证start < end
        if(start > end) {
          [start, end] = [end, start];
        }
        currentValue[start] = 'start';

        // end在另一个范围内，向右延伸
        if(currentValue[end] !== false) {
          let length = currentValue.length;
          while(currentValue[end] !== 'end') {
            end++;
          }
        }
        // 中间设为true
        for(let i = start + 1; i <= end - 1; i++) {
          currentValue[i] = true;
        }
        currentValue[end] = 'end';
        this.currentValue = currentValue;
      },
      convert(list) {
        let arr = Array(this.options.length).fill(false);
        list.forEach(v => {
          if(v.indexOf('-') > 0) {
            let [start, end] = v.split('-');
            start = parseInt(start, 10) - 1;
            end = parseInt(end, 10) - 1;
            arr[start] = 'start';
            arr[end] = 'end';
            for(let i = start + 1; i < end; i++) {
              arr[i] = true;
            }
          }
        });
        return arr;
      },
      serialize(arr) {
        let result = [];
        let start = false;
        let end = false;
        for(let i = 0, len = arr.length; i < len; i++) {
          if(arr[i] === 'start') {
            start = i;
          } else if(arr[i] === 'end') {
            end = i;
            result.push(`${start + 1}-${end + 1}`);
          }
        }
        return result;
      }
    }
  }
</script>

<style scoped>
.random-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
.random-cell {
  position: relative;
  width: 12.5%;
  height: 40px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #e0e0e0;
}
.random-cell:hover {
  cursor: pointer;
}
.random-cell.selected {
  background-color: #f56c6c;
  color: #ffffff;
}
.random-cell.start,
.random-cell.end {
  background-color: #409eff;
  color: #ffffff;
}
.random-cell.start:before,
.random-cell.end:before {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
}
.random-cell.start:before {
  content: 'start';
}
.random-cell.end:before {
  content: 'end';
}
.random-cell.middle {
  background-color: #67c23a;
  color: #ffffff;
}
</style>
