import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as createCsvWriter from 'csv-writer';

const storeBrandList = 
["스타벅스", "메가커피", "투썸", "이디야", "메머드커피" ];

const storePlaceList = 
["홍대", "잠실", "용산", "강서" ];

let brand;
let place;

class IdGenerator {
  generateId() {
    const userId = uuidv4();
    return userId;
  }
}

class BrandGenerator {
  generateBrand() {
    brand = storeBrandList[Math.floor(Math.random() * storeBrandList.length)];
    const storebrand = `${brand}`;
    return storebrand;
  }
}

class StoreGenerator {
  constructor(brand, place) {
    this.brand = brand;
    this.place = place;
  }
  generateStore() {
    place = storePlaceList[Math.floor(Math.random() * storePlaceList.length)];
    const num = Math.floor(Math.random()*10+1);
    return `${brand} ${place} ${num}호점`
  }
}

class DataGenerator {
  constructor() {
    this.idGen = new IdGenerator();
    this.brandGen = new BrandGenerator();
    this.storeGen = new StoreGenerator();
  }
  generateData(count) {
      const stores = [];
      for (let i = 0; i < count; i++) {
          const id = this.idGen.generateId();
          const brand = this.brandGen.generateBrand();
          const store = this.storeGen.generateStore();
          stores.push([id, brand, store]);
      }
      return stores;
  }
}

class DataExporter extends DataGenerator {
  constructor() {
    super();
  }
  exportToCsv(count, filename) {
    const data = this.generateData(count);
    
    const folderPath = 'csv';
    if(!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    // 파일 경로 설정
    const filePath = path.join(folderPath, filename);

    const csv = createCsvWriter.createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'ID', title: 'ID' },
            { id: 'Brand', title: 'Brand' },
            { id: 'Store', title: 'Store' },
        ]
    });

      const records = data.map(([id, brand, store]) => ({
          ID: id,
          Brand: brand,
          Store: store,
      }));

      csv.writeRecords(records)
          .then(() => console.log(`CSV file ${filename} has been written successfully`))
          .catch((err) => console.error(err));
  }
}

const exporter = new DataExporter();
// CSV 파일로 저장
exporter.exportToCsv(1000, 'store.csv');  
