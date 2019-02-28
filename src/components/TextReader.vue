<template>
  <div class="container">
    <div class="upload_section" v-if="!showTable">
      <h1>Upload Files</h1>
      <div class="dropbox">
        <input class="input-file" type="file" @change="loadTextFromFile" multiple="multiple" accept=".text">
        <p>Drag your file here to begin<br> or <br>click to browse</p>
      </div>
    </div>
    <div class="output" v-if="showTable">
      <div class="header">
        <p class="main_heading">Final Output In Table Format</p>
        <button class="button right" @click="downloadExcel()">Download Excel</button>
      </div>
      <Tabs
        :tabs="tabs"
        :current-tab="currentTab"
        @onClick="handleClick"
      />
      <div class="content">
        <div v-if="currentTab === 'tab1'">
          <vue-good-table
            :columns="columns_filtered"
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
            :columns="columns_without_filter"
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
    fileCount: '',
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
    columns_filtered: [
      {
        label: 'PLU',
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
        label: 'ASIN',
        field: 'ASIN',
      },
      {
        label: 'Error Message',
        field: 'error-msg',
      },
    ],
    columns_without_filter: [
      {
        label: 'PLU',
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
      { title: '8541 & 8542 Errors', value: 'tab1' },
      { title: 'Remaining Errors', value: 'tab2' },
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
      const numFiles = files.length;
      this.fileCount = numFiles;
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
                if(productSKU[1]) {
                  if (singleRow['2'] === '8541' || singleRow['2'] === '8542') {
                    let replaceString = '';
                    let that = this;
                    replaceString = that.replaceAllStrings(this.replaceStrings['0'], '', singleRow['4']);
                    this.replaceStrings.forEach(function (str) {
                      replaceString = that.replaceAllStrings(str, '', replaceString);
                    });
                    let obj = {};
                    obj['product'] = productSKU[0];
                    obj['ASIN'] = replaceString.trim().substring(0,10);
                    obj['SKU'] = productSKU[1];
                    obj['error-code'] = singleRow['2'];
                    obj['error-msg'] = replaceString.trim().substring(11);
                    finalOutput.push(obj);
                  } else if(productSKU[1] !== 'undefined' || productSKU[1] !== undefined) {
                    let obj = {};
                    obj['product'] = productSKU[0];
                    obj['SKU'] = productSKU[1];
                    obj['error-code'] = singleRow['2'];
                    obj['error-msg'] = singleRow['4'];
                    afterFilter.push(obj);
                  }
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
    },
    downloadExcel() {
      if(this.currentTab === 'tab1') {
        this.JSONToCSVConvertor(this.matchedRecords, "Filtered Data", true);
      } else if(this.currentTab === 'tab2') {
        this.JSONToCSVConvertor(this.allRecords, "Data after Filter", true);
      }
    },
    JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      const arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      let CSV = '';
      //Set Report title in first row or line
      CSV += ReportTitle + '\r\n\n';
      //This condition will generate the Label/Header
      if (ShowLabel) {
        let row = "";
        //This loop will extract the label from 1st index of on array
        for (const index in arrData[0]) {
          //Now convert each value to string and comma-seprated
          row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        CSV += row + '\r\n';
      }

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
      }
      if (CSV == '') {
          alert("Invalid data");
          return;
      }
      //Generate a file name
      var fileName = "MyReport_";
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g,"_");

      //Initialize file format you want csv or xls
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension

      //this trick will generate a temp <a /> tag
      var link = document.createElement("a");
      link.href = uri;

      //set the visibility hidden so it will not effect on your web-layout
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style lang="scss">
/* File Upload css Starts here */
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    height: 200px;
    position: absolute;
    cursor: pointer;
    width: 100%;
    left: 0;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
/* File Upload css Ends here */
</style>
<style>
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
  width: 40%;
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
