import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as createCsvWriter from 'csv-writer';

const familyname = ['강','고','곽','구','권','김','나','남','문','민','박','배','백',
            '서','성','손','신','신','심','안','양','엄','오','원','유','윤','이','임',
            '장','전','정','조','주','지','진','차','최','하','한','허','홍','황'];
const middle = ['규','도','민','서','시','서','주','예','유','윤','은','연','승','선','지','진','수','채','현','하']
const last = ['늘','람','빈','우','윤','연','영','아','안','성','은','윤','서','준','진','재','찬','현','혁','호','후','훈','율']

const addressList = [
    ["서울특별시", '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    ["부산광역시", '중구', '동구', '서구', '영도구', '부산진구', '동래구', '남구', '연제구', '수영구', '사상구'],
    ["광주광역시", '동구', '서구', '남구', '북구', '광산구']
  ];

class NameGenerator {
  generateName() {
    const lastname = familyname[Math.floor(Math.random() * familyname.length)];
    const name1 = middle[Math.floor(Math.random() * middle.length)];
    const name2 = last[Math.floor(Math.random() * last.length)];
    const fullname = `${lastname}${name1}${name2}`
    return fullname;
    }
  }

class GenderGenerator {
  generateGender() {
    return Math.random() < 0.5 ? 'Male' : 'FeMale';
  }
}

class AddressGenerator {
   generateAddress() {
    const cityIndex = Math.floor(Math.random() * addressList.length);
    const List = addressList[cityIndex];
    const city = List[0];

    const guIndex = Math.floor(Math.random() * (List.length - 1)) + 1;
    const gu = List[guIndex];

    const street = Math.floor(Math.random() * 100) + 1;
    const street2 = Math.floor(Math.random() * 100) + 1;
    const address = `${city} ${gu} ${street}로 ${street2}길`;
    return address;
  }
}

class BirthdateGenerator {
 generateBirthdate() {
  const year = Math.floor(Math.random() * (2005 - 1970 + 1)) + 1970;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
}

class IdGenerator {
  generateId() {
  const userId = uuidv4();
  return userId;
  }
}

class DataGenerator {
  constructor() {
    this.idGen = new IdGenerator();
    this.nameGen = new NameGenerator();
    this.genderGen = new GenderGenerator();
    this.birthdateGen = new BirthdateGenerator();
    this.addressGen = new AddressGenerator();
  }
  generateData(count) {
      const user = [];
      for (let i = 0; i < count; i++) {
          const id = this.idGen.generateId();
          const name = this.nameGen.generateName();
          const birthdate = this.birthdateGen.generateBirthdate();
          const gender = this.genderGen.generateGender();
          const address = this.addressGen.generateAddress();
          user.push([id, name, birthdate, gender, address]);
      }
      return user;
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
            { id: 'Name', title: 'Name' },
            { id: 'Birthdate', title: 'Birthdate' },
            { id: 'Gender', title: 'Gender' },
            { id: 'Address', title: 'Address' }
        ]
    });

      const records = data.map(([id, name, birthdate, gender, address]) => ({
          ID: id,
          Name: name,
          Birthdate: birthdate,
          Gender: gender,
          Address: address
      }));

      csv.writeRecords(records)
          .then(() => console.log(`CSV file ${filename} has been written successfully`))
          .catch((err) => console.error(err));
  }
}

const exporter = new DataExporter();
// CSV 파일로 저장
exporter.exportToCsv(1000, 'user.csv');  
