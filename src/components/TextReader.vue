<template>
  <div class="container">
    <label class="text-reader">
      Upload Files
      <input type="file" @change="loadTextFromFile" multiple="multiple">
    </label>
    <div class="output" v-if="showTable">
      <div class="header">
        <p class="main_heading">Final Output Table Formatter</p>
        <button class="button right">Download Excel</button>
      </div>
      <vue-good-table
        :columns="columns"
        :rows="matchedRecords"
        max-height="500px"
        :fixed-header="true"
        :line-numbers="true"
        :search-options="{
          enabled: true
        }"
      />
    </div>
  </div>
</template>

<script>

import { VueGoodTable } from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'
export default {
  components: {
    VueGoodTable,
  },
  data: () => ({
    matchedRecords: [],
    showTable: false,
    columns: [
        {
          label: 'Product',
          field: 'product',
          type: 'number',
        },
        {
          label: 'SKU',
          field: 'SKU',
          type: 'number',
        },
        {
          label: 'Error Code',
          field: 'error-code',
        },
        {
          label: 'Error Message',
          field: 'error-msg',
        },
      ],
  }),
  methods: {
    loadTextFromFile(ev) {
      const files = ev.target.files;
      if (!files.length)
        return;
      const finalOutput = [];
      const numFiles = files.length
      for (let i = 0; i < numFiles; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = event => {
          const file = event.target.result;
          const allLines = file.split(/\r\n|\n/);
          // Reading line by line
          allLines.forEach((line, index) => {
            if(index > 4) {                              // Avoiding the first 5 lines
              const singleRow = line.split('\t');       // Splitting the single line into coloumns
              if(singleRow['2'] === '8541' || singleRow['2'] === '8542') {
                const productSKU = singleRow['1'].split('.');
                var obj = {};
                obj['product'] = productSKU[0];
                obj['SKU'] = productSKU[1];
                obj['error-code'] = singleRow['2'];
                obj['error-msg'] = singleRow['4'];
                finalOutput.push(obj);
              }
              // console.log(index, line);
            }
          });
        }
        this.matchedRecords = finalOutput;
        reader.onerror = (event) => {
          alert(event.target.error.name);
        };
        reader.readAsText(file);
      }
      if (this.matchedRecords !== null)
        this.showTable = true;
    }
  }
};
</script>

<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  /* Fancy button looking */
  border: 2px solid black;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
.main_heading {
  text-align: left;
  font-size: 25px;
  color: white;
  display: inline-block;
  vertical-align: middle;
  margin: 10px;
}
.right {
  float: right;
}
.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 8px;
}
.header {
  background-color: rebeccapurple;
  text-align: left;
  margin-bottom: 1rem;
}
</style>
