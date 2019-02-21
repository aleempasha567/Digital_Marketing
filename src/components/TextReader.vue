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
      <Tabs
        :tabs="tabs"
        :current-tab="currentTab"
        @onClick="handleClick"
      />
      <div class="content">
        <div v-if="currentTab === 'tab1'">
          <vue-good-table
            :columns="columns"
            :rows="matchedRecords"
            max-height="500px"
            :fixed-header="true"
            :line-numbers="true"
            :search-options="{
              enabled: true
            }"
            :pagination-options="{
              enabled: true
            }"
          />
        </div>
        <div v-if="currentTab === 'tab2'">
          <vue-good-table
            :columns="columns"
            :rows="allRecords"
            max-height="500px"
            :fixed-header="true"
            :line-numbers="true"
            :search-options="{
              enabled: true
            }"
            :pagination-options="{
              enabled: true
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { VueGoodTable } from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'
import Tabs from 'vue-tabs-with-active-line';

export default {
  components: {
    VueGoodTable,
    Tabs,
  },
  data: () => ({
    matchedRecords: [],
    allRecords: [],
    showTable: false,
    replaceStrings: [
      "The SKU data provided is different from what's already in the Amazon catalog. The standard_product_id data provided matches ASIN",
      "but the following data is different from what's already in the Amazon catalog:",
      ". If this is the right ASIN for your product, update your data to match what's in the Amazon catalog. If it's not the right ASIN, make sure that your data for standard_product_id is correct.",
      "The SKU data provided conflicts with the Amazon catalog. The standard_product_id value(s) provided correspond to the ASIN",
      "but some information contradicts with the Amazon catalog. The following are the attribute value(s) that are conflicting:",
      ". If your product is this ASIN, then modify your data to reflect the Amazon catalog values. Else, check your value(s) for standard_product_id are correct.",
      ". If your product is this ASIN, then modify your data to reflect the Amazon catalog values. Else, check your value(s) for  standard_product_id are correct.",
      "The SKU data provided is different from what's already in the Amazon catalog. The item_id data provided matches ASIN",
      ". If this is the right ASIN for your product, update your data to match what's in the Amazon catalog. If it's not the right ASIN, make sure that your data for item_id is correct.",
    ],
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
    tabs: [
      { title: 'Filtered Data', value: 'tab1' },
      { title: 'Data after Filter', value: 'tab2' },
    ],
    currentTab: 'tab1',
  }),
  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    loadTextFromFile(ev) {
      const files = ev.target.files;
      if (!files.length)
        return;
      const finalOutput = [];
      const afterFilter = [];
      const numFiles = files.length
      for (let i = 0; i < numFiles; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = event => {
          const file = event.target.result;
          const allLines = file.split(/\r\n|\n/);
          // Reading line by line
          allLines.forEach((line, index) => {
            if(index > 4 && line !== null && line !== '') { // Avoiding the first 5 lines
              const singleRow = line.split('\t'); // Splitting the single line into coloumns
              if (singleRow['1'] !== 'undefined') {
                const productSKU = singleRow['1'].split('.');
                if (singleRow['2'] === '8541' || singleRow['2'] === '8542') {
                  let replaceString = '';
                  let that = this;
                  replaceString = that.replaceAllStrings(this.replaceStrings['0'], '', singleRow['4']);
                  this.replaceStrings.forEach(function (str) {
                    replaceString = that.replaceAllStrings(str, '', replaceString);
                  });
                  let obj = {};
                  obj['product'] = productSKU[0];
                  obj['SKU'] = productSKU[1];
                  obj['error-code'] = singleRow['2'];
                  obj['error-msg'] = replaceString;
                  finalOutput.push(obj);
                } else {
                  let obj = {};
                  obj['product'] = productSKU[0];
                  obj['SKU'] = productSKU[1];
                  obj['error-code'] = singleRow['2'];
                  obj['error-msg'] = singleRow['4'];
                  afterFilter.push(obj);
                }
              }
            }
          });
        }
        this.matchedRecords = finalOutput;
        this.allRecords = afterFilter;
        reader.onerror = (event) => {
          alert(event.target.error.name);
        };
        reader.readAsText(file);
      }
      if (this.matchedRecords !== null)
        this.showTable = true;
    },
    replaceAllStrings(find, replace, str) {
      while(str.indexOf(find) > -1) {
        str = str.replace(find, replace);
      }
      return str;
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
/* Tabs CSS Start Here */
.tabs {
  background-color: #337ab7;
  width: 20%;
  margin: 1rem auto;
}

.tabs__item {
  display: inline-block;
  margin: 0 -2px;
  padding: 10px;
  padding-bottom: 8px;
  font-size: 16px;
  letter-spacing: .8px;
  color: #fff;
  text-decoration: none;
  border: none;
  background-color: transparent;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all .25s;
}

.tabs__item:focus {
  outline: none;
}

.tabs__item_active {
  background-color: #25435d;
}

.tabs__item:first-child {
  margin-left: 0;
}

.tabs__active-line {
  position: absolute;
  left: 0;
  height: 2px;
  background-color: blue;
  transition: transform .4s ease, width .4s ease;
  display: none;
}
</style>
