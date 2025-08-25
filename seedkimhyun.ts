// 시드 데이터 생성 스크립트
// 실행: npx ts-node seed.ts

import { DataSource } from 'typeorm';
import { Admin } from './src/admin/entities/admin.entity';
import { Store } from './src/stores/entities/store.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'laundry_talktalk',
  entities: [Admin, Store],
  synchronize: true,
});

async function seedData() {
  await AppDataSource.initialize();

  const adminRepository = AppDataSource.getRepository(Admin);
  const storeRepository = AppDataSource.getRepository(Store);

  // Admin 테스트 데이터 10개
  const adminData = [
    { user_id: 'admin001', store_id: 'STORE001' },
    { user_id: 'admin002', store_id: 'STORE002' },
    { user_id: 'admin003', store_id: 'STORE003' },
    { user_id: 'admin004', store_id: 'STORE004' },
    { user_id: 'admin005', store_id: 'STORE005' },
    { user_id: 'admin006', store_id: 'STORE006' },
    { user_id: 'admin007', store_id: 'STORE007' },
    { user_id: 'admin008', store_id: 'STORE008' },
    { user_id: 'admin009', store_id: 'STORE009' },
    { user_id: 'admin010', store_id: 'STORE010' },
  ];

  // Store 테스트 데이터 10개 (서울 지역 세탁소)
  const storeData = [
    {
      admin_id: 1,
      store_name: '깨끗한세탁소 강남점',
      store_address: '서울특별시 강남구 테헤란로 123',
      store_number: '02-1234-5678',
      store_latitude: 37.5665,
      store_longitude: 127.0780,
      store_url: 'https://cleanlaundry-gangnam.com',
      store_business_hour_start_time: '08:00',
      store_business_hour_end_time: '22:00',
    },
    {
      admin_id: 2,
      store_name: '빨래방 홍대점',
      store_address: '서울특별시 마포구 홍익로 456',
      store_number: '02-2345-6789',
      store_latitude: 37.5502,
      store_longitude: 126.9227,
      store_url: 'https://laundryshop-hongdae.com',
      store_business_hour_start_time: '07:00',
      store_business_hour_end_time: '23:00',
    },
    {
      admin_id: 3,
      store_name: '미스터세탁 명동점',
      store_address: '서울특별시 중구 명동길 789',
      store_number: '02-3456-7890',
      store_latitude: 37.5636,
      store_longitude: 126.9834,
      store_url: 'https://misterlaundry-myeongdong.com',
      store_business_hour_start_time: '09:00',
      store_business_hour_end_time: '21:00',
    },
    {
      admin_id: 4,
      store_name: '깔끔세탁소 이태원점',
      store_address: '서울특별시 용산구 이태원로 321',
      store_number: '02-4567-8901',
      store_latitude: 37.5346,
      store_longitude: 126.9947,
      store_url: 'https://neatlaundry-itaewon.com',
      store_business_hour_start_time: '08:30',
      store_business_hour_end_time: '22:30',
    },
    {
      admin_id: 5,
      store_name: '신속세탁 종로점',
      store_address: '서울특별시 종로구 종로 654',
      store_number: '02-5678-9012',
      store_latitude: 37.5704,
      store_longitude: 126.9821,
      store_url: 'https://quicklaundry-jongro.com',
      store_business_hour_start_time: '07:30',
      store_business_hour_end_time: '23:30',
    },
    {
      admin_id: 6,
      store_name: '완벽세탁소 건대점',
      store_address: '서울특별시 광진구 능동로 987',
      store_number: '02-6789-0123',
      store_latitude: 37.5403,
      store_longitude: 127.0695,
      store_url: 'https://perfectlaundry-konkuk.com',
      store_business_hour_start_time: '08:00',
      store_business_hour_end_time: '22:00',
    },
    {
      admin_id: 7,
      store_name: '프리미엄세탁 압구정점',
      store_address: '서울특별시 강남구 압구정로 147',
      store_number: '02-7890-1234',
      store_latitude: 37.5270,
      store_longitude: 127.0276,
      store_url: 'https://premiumlaundry-apgujeong.com',
      store_business_hour_start_time: '09:00',
      store_business_hour_end_time: '21:00',
    },
    {
      admin_id: 8,
      store_name: '24시세탁소 신촌점',
      store_address: '서울특별시 서대문구 신촌로 258',
      store_number: '02-8901-2345',
      store_latitude: 37.5596,
      store_longitude: 126.9370,
      store_url: 'https://24hlaundry-sinchon.com',
      store_business_hour_start_time: '00:00',
      store_business_hour_end_time: '23:59',
    },
    {
      admin_id: 9,
      store_name: '친환경세탁소 여의도점',
      store_address: '서울특별시 영등포구 여의대로 369',
      store_number: '02-9012-3456',
      store_latitude: 37.5219,
      store_longitude: 126.9245,
      store_url: 'https://ecolaundry-yeouido.com',
      store_business_hour_start_time: '08:00',
      store_business_hour_end_time: '20:00',
    },
    {
      admin_id: 10,
      store_name: '고급세탁 청담점',
      store_address: '서울특별시 강남구 청담동 741',
      store_number: '02-0123-4567',
      store_latitude: 37.5172,
      store_longitude: 127.0473,
      store_url: 'https://luxurylaundry-ceongdam.com',
      store_business_hour_start_time: '10:00',
      store_business_hour_end_time: '19:00',
    },
  ];

  try {
    console.log('데이터 삽입을 시작합니다...');

    // Admin 데이터 삽입
    const createdAdmins: Admin[] = [];
    for (const admin of adminData) {
      const existingAdmin = await adminRepository.findOne({ where: { user_id: admin.user_id } });
      if (!existingAdmin) {
        const savedAdmin = await adminRepository.save(admin);
        createdAdmins.push(savedAdmin);
        console.log(`Admin ${admin.user_id} 생성됨`);
      } else {
        createdAdmins.push(existingAdmin);
        console.log(`Admin ${admin.user_id} 이미 존재함`);
      }
    }

    // Store 데이터 삽입 (admin 객체 참조)
    for (let i = 0; i < storeData.length; i++) {
      const store = storeData[i];
      const existingStore = await storeRepository.findOne({ where: { store_name: store.store_name } });
      if (!existingStore) {
        // admin_id 대신 admin 객체 참조
        const storeWithAdmin = {
          ...store,
          admin: createdAdmins[i] // admin_id 대신 admin 객체 사용
        };
        delete (storeWithAdmin as any).admin_id; // admin_id 필드 제거
        
        await storeRepository.save(storeWithAdmin);
        console.log(`Store ${store.store_name} 생성됨`);
      } else {
        console.log(`Store ${store.store_name} 이미 존재함`);
      }
    }

    console.log('모든 시드 데이터가 성공적으로 삽입되었습니다!');
  } catch (error) {
    console.error('시드 데이터 삽입 중 오류 발생:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedData().catch(console.error);
