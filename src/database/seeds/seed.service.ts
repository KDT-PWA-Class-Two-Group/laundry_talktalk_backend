import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { FavStore } from '../../auth/entities/fav-store.entity';
import { MachineOptions } from '../../machine/entities/machine-options.entity';
import { Machine } from '../../machine/entities/machine.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Review } from '../../reviews/entities/review.entity';
import { ReviewComment } from '../../reviews/entities/review_comment.entity';
import { StoreNoticeEvent } from '../../store_notice_event/entities/store_notice_event.entity';
import { Store } from '../../stores/entities/store.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    @InjectRepository(Store) private storeRepo: Repository<Store>,
    @InjectRepository(FavStore) private favStoreRepo: Repository<FavStore>,
    @InjectRepository(MachineOptions) private machineOptionsRepo: Repository<MachineOptions>,
    @InjectRepository(Machine) private machineRepo: Repository<Machine>,
    @InjectRepository(Reservation) private reservationRepo: Repository<Reservation>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(ReviewComment) private reviewCommentRepo: Repository<ReviewComment>,
    @InjectRepository(StoreNoticeEvent) private storeNoticeEventRepo: Repository<StoreNoticeEvent>,
  ) {}

  async seed() {
    console.log('🌱 Starting database seeding...');

    // 1. 기존 데이터 정리 (역순으로 삭제)
    await this.clearData();

    // 2. 사용자 데이터 생성
    const users = await this.seedUsers();
    console.log('✅ Users seeded');

    // 3. 매장 데이터 생성
    const stores = await this.seedStores(users);
    console.log('✅ Stores seeded');

    // 4. 세탁기 옵션 데이터 생성
    const machineOptions = await this.seedMachineOptions();
    console.log('✅ Machine options seeded');

    // 5. 세탁기 데이터 생성
    const machines = await this.seedMachines(stores, users, machineOptions);
    console.log('✅ Machines seeded');

    // 6. 예약 데이터 생성
    const reservations = await this.seedReservations(stores, users, machines);
    console.log('✅ Reservations seeded');

    // 7. 리뷰 데이터 생성
    const reviews = await this.seedReviews(stores, users, machines, reservations);
    console.log('✅ Reviews seeded');

    // 8. 리뷰 댓글 데이터 생성
    await this.seedReviewComments(reviews, stores, users, machines, reservations);
    console.log('✅ Review comments seeded');

    // 9. 즐겨찾기 데이터 생성
    await this.seedFavStores(users, stores);
    console.log('✅ Favorite stores seeded');

    // 10. 매장 공지/이벤트 데이터 생성
    await this.seedStoreNoticeEvents(stores, users);
    console.log('✅ Store notice events seeded');

    console.log('🎉 Database seeding completed!');
  }

  private async clearData() {
    console.log('🧹 Clearing existing data...');
    
    // PostgreSQL에서는 외래키 제약조건을 일시적으로 비활성화하고 CASCADE로 삭제
    await this.authRepo.query('SET session_replication_role = replica');
    
    // 의존관계에 따라 역순으로 삭제 (가장 의존적인 것부터)
    await this.reviewCommentRepo.query('TRUNCATE TABLE "review_comment" RESTART IDENTITY CASCADE');
    await this.reviewRepo.query('TRUNCATE TABLE "review" RESTART IDENTITY CASCADE');
    await this.reservationRepo.query('TRUNCATE TABLE "reservation" RESTART IDENTITY CASCADE');
    await this.machineRepo.query('TRUNCATE TABLE "machine_options_relation" RESTART IDENTITY CASCADE');
    await this.machineRepo.query('TRUNCATE TABLE "machine" RESTART IDENTITY CASCADE');
    await this.machineOptionsRepo.query('TRUNCATE TABLE "machine_options" RESTART IDENTITY CASCADE');
    
    // store_notice_event 테이블이 존재하는 경우에만 TRUNCATE
    try {
      await this.storeNoticeEventRepo.query('TRUNCATE TABLE "store_notice_event" RESTART IDENTITY CASCADE');
      console.log('🗑️ store_notice_event table cleared');
    } catch (error) {
      console.log('⚠️ store_notice_event table might not exist yet:', error.message);
    }
    
    await this.favStoreRepo.query('TRUNCATE TABLE "fav_store" RESTART IDENTITY CASCADE');
    await this.storeRepo.query('TRUNCATE TABLE "store" RESTART IDENTITY CASCADE');
    await this.authRepo.query('TRUNCATE TABLE "auth" RESTART IDENTITY CASCADE');
    
    // 외래키 제약조건을 다시 활성화
    await this.authRepo.query('SET session_replication_role = DEFAULT');
  }

  private async seedUsers(): Promise<Auth[]> {
    const usersData = [
      {
        loginId: 'admin',
        email: 'admin@laundry.com',
        passwordHash: 'password123',
        phone: '010-1234-5678',
        isAdmin: false,
      },
      {
        loginId: 'user1',
        email: 'user1@laundry.com',
        passwordHash: 'password123',
        phone: '010-2345-6789',
        isAdmin: false,
      },
      {
        loginId: 'user2',
        email: 'user2@laundry.com',
        passwordHash: 'password123',
        phone: '010-3456-7890',
        isAdmin: false,
      },
      {
        loginId: 'user3',
        email: 'user3@laundry.com',
        passwordHash: 'password123',
        phone: '010-3456-7891',
        isAdmin: false,
      },
      {
        loginId: 'user4',
        email: 'user4@laundry.com',
        passwordHash: 'password123',
        phone: '010-3456-7892',
        isAdmin: false,
      },
      {
        loginId: 'user5',
        email: 'user5@laundry.com',
        passwordHash: 'password123',
        phone: '010-3456-7893',
        isAdmin: false,
      },
      {
        loginId: 'storeowner1',
        email: 'owner1@laundry.com',
        passwordHash: 'password123',
        phone: '010-4567-8901',
        isAdmin: true,
      },
      {
        loginId: 'storeowner2',
        email: 'owner2@laundry.com',
        passwordHash: 'password123',
        phone: '010-5678-9012',
        isAdmin: true,
      },
      {
        loginId: 'storeowner3',
        email: 'owner3@laundry.com',
        passwordHash: 'password123',
        phone: '010-5678-9013',
        isAdmin: true,
      },
      {
        loginId: 'storeowner4',
        email: 'owner4@laundry.com',
        passwordHash: 'password123',
        phone: '010-5678-9014',
        isAdmin: true,
      },
    ];

    const users: Auth[] = [];
    for (const userData of usersData) {
      const user = this.authRepo.create(userData);
      const savedUser = await this.authRepo.save(user);
      users.push(savedUser);
    }

    return users;
  }

  private async seedStores(users: Auth[]): Promise<Store[]> {
    const storesData = [
      {
        user: users[6], // storeowner1
        store_name: '깨끗한세탁소 강남점',
        store_address: '서울특별시 강남구 테헤란로 123',
        store_number: '02-1234-5678',
        store_latitude: 37.5013,
        store_longitude: 127.0396,
        store_url: 'https://cleanlaundry-gangnam.com',
        store_business_hour_start_time: '08:00:00',
        store_business_hour_end_time: '22:00:00',
      },
      {
        user: users[7], // storeowner2
        store_name: '24시간 빨래방 홍대점',
        store_address: '서울특별시 마포구 홍익로 456',
        store_number: '02-2345-6789',
        store_latitude: 37.5519,
        store_longitude: 126.9226,
        store_url: 'https://24laundry-hongdae.com',
        store_business_hour_start_time: '00:00:00',
        store_business_hour_end_time: '23:59:59',
      },
      {
        user: users[8], // storeowner3
        store_name: '코인세탁소 신촌점',
        store_address: '서울특별시 서대문구 신촌로 789',
        store_number: '02-3456-7890',
        store_latitude: 37.5559,
        store_longitude: 126.9356,
        store_url: 'https://coinlaundry-sinchon.com',
        store_business_hour_start_time: '06:00:00',
        store_business_hour_end_time: '24:00:00',
      },
      {
        user: users[9], // storeowner4
        store_name: '깔끔세탁소 잠실점',
        store_address: '서울특별시 송파구 올림픽로 321',
        store_number: '02-4567-8901',
        store_latitude: 37.5134,
        store_longitude: 127.1000,
        store_url: 'https://cleanlaundry-jamsil.com',
        store_business_hour_start_time: '07:00:00',
        store_business_hour_end_time: '23:00:00',
      },
      {
        user: users[6], // storeowner1
        store_name: '편리한빨래방 이태원점',
        store_address: '서울특별시 용산구 이태원로 654',
        store_number: '02-5678-9012',
        store_latitude: 37.5336,
        store_longitude: 126.9946,
        store_url: 'https://easylaundry-itaewon.com',
        store_business_hour_start_time: '08:00:00',
        store_business_hour_end_time: '22:00:00',
      },
      {
        user: users[7], // storeowner2
        store_name: '스마트세탁소 명동점',
        store_address: '서울특별시 중구 명동길 987',
        store_number: '02-6789-0123',
        store_latitude: 37.5636,
        store_longitude: 126.9834,
        store_url: 'https://smartlaundry-myeongdong.com',
        store_business_hour_start_time: '09:00:00',
        store_business_hour_end_time: '21:00:00',
      },
      {
        user: users[8], // storeowner3
        store_name: '퀵세탁소 건대점',
        store_address: '서울특별시 광진구 능동로 147',
        store_number: '02-7890-1234',
        store_latitude: 37.5404,
        store_longitude: 127.0688,
        store_url: 'https://quicklaundry-konkuk.com',
        store_business_hour_start_time: '08:30:00',
        store_business_hour_end_time: '22:30:00',
      },
      {
        user: users[9], // storeowner4
        store_name: '프리미엄세탁소 압구정점',
        store_address: '서울특별시 강남구 압구정로 258',
        store_number: '02-8901-2345',
        store_latitude: 37.5274,
        store_longitude: 127.0286,
        store_url: 'https://premiumlaundry-apgujeong.com',
        store_business_hour_start_time: '09:00:00',
        store_business_hour_end_time: '20:00:00',
      },
      {
        user: users[6], // storeowner1
        store_name: '셀프빨래방 노원점',
        store_address: '서울특별시 노원구 상계로 369',
        store_number: '02-9012-3456',
        store_latitude: 37.6541,
        store_longitude: 127.0568,
        store_url: 'https://selflaundry-nowon.com',
        store_business_hour_start_time: '06:00:00',
        store_business_hour_end_time: '23:00:00',
      },
      {
        user: users[7], // storeowner2
        store_name: '올데이세탁소 성수점',
        store_address: '서울특별시 성동구 성수일로 741',
        store_number: '02-0123-4567',
        store_latitude: 37.5445,
        store_longitude: 127.0557,
        store_url: 'https://alldaylaundry-seongsu.com',
        store_business_hour_start_time: '07:30:00',
        store_business_hour_end_time: '23:30:00',
      },
    ];

    const stores: Store[] = [];
    for (const storeData of storesData) {
      const store = this.storeRepo.create(storeData);
      const savedStore = await this.storeRepo.save(store);
      stores.push(savedStore);
    }

    return stores;
  }

  private async seedMachineOptions(): Promise<MachineOptions[]> {
    const optionsData = [
      // 세탁기 필수 옵션들 (machine_type: true, options_type: true)
      {
        options_name: '표준세탁',
        options_base_time: '40',
        options_base_price: '3000',
        options_type: true, // 필수옵션
        machine_type: true, // 세탁기
      },
      {
        options_name: '울세탁',
        options_base_time: '60',
        options_base_price: '5000',
        options_type: true, // 필수옵션
        machine_type: true, // 세탁기
      },
      {
        options_name: '이불세탁',
        options_base_time: '70',
        options_base_price: '8000',
        options_type: true, // 필수옵션
        machine_type: true, // 세탁기
      },
      {
        options_name: '아웃도어및패딩세탁',
        options_base_time: '80',
        options_base_price: '10000',
        options_type: true, // 필수옵션
        machine_type: true, // 세탁기
      },
      // 세탁기 선택 옵션들 (machine_type: true, options_type: false)
      {
        options_name: '행굼추가',
        options_base_time: '15',
        options_base_price: '1000',
        options_type: false, // 선택옵션
        machine_type: true, // 세탁기
      },
      {
        options_name: '고온세탁옵션',
        options_base_time: '10',
        options_base_price: '500',
        options_type: false, // 선택옵션
        machine_type: true, // 세탁기
      },
      {
        options_name: '저온세탁옵션',
        options_base_time: '5',
        options_base_price: '500',
        options_type: false, // 선택옵션
        machine_type: true, // 세탁기
      },
      {
        options_name: '찌든때세탁옵션',
        options_base_time: '20',
        options_base_price: '2000',
        options_type: false, // 선택옵션
        machine_type: true, // 세탁기
      },
      // 건조기 필수 옵션들 (machine_type: false, options_type: true)
      {
        options_name: '고온건조',
        options_base_time: '30',
        options_base_price: '3000',
        options_type: true, // 필수옵션
        machine_type: false, // 건조기
      },
      {
        options_name: '중온건조',
        options_base_time: '35',
        options_base_price: '2500',
        options_type: true, // 필수옵션
        machine_type: false, // 건조기
      },
      {
        options_name: '저온건조',
        options_base_time: '45',
        options_base_price: '2000',
        options_type: true, // 필수옵션
        machine_type: false, // 건조기
      },
      // 건조기 선택 옵션들 (machine_type: false, options_type: false)
      {
        options_name: '5분추가',
        options_base_time: '5',
        options_base_price: '500',
        options_type: false, // 선택옵션
        machine_type: false, // 건조기
      },
      {
        options_name: '10분추가',
        options_base_time: '10',
        options_base_price: '1000',
        options_type: false, // 선택옵션
        machine_type: false, // 건조기
      },
      {
        options_name: '15분추가',
        options_base_time: '15',
        options_base_price: '1500',
        options_type: false, // 선택옵션
        machine_type: false, // 건조기
      },
      {
        options_name: '20분추가',
        options_base_time: '20',
        options_base_price: '2000',
        options_type: false, // 선택옵션
        machine_type: false, // 건조기
      },
    ];

    const options: MachineOptions[] = [];
    for (const optionData of optionsData) {
      const option = this.machineOptionsRepo.create(optionData);
      const savedOption = await this.machineOptionsRepo.save(option);
      options.push(savedOption);
    }

    return options;
  }

  private async seedMachines(stores: Store[], users: Auth[], options: MachineOptions[]): Promise<Machine[]> {
    const machines: Machine[] = [];
    
    // 세탁기 필수 옵션들
    const washingRequiredOptions = options.filter(opt => opt.machine_type === true && opt.options_type === true);
    // 세탁기 선택 옵션들
    const washingOptionalOptions = options.filter(opt => opt.machine_type === true && opt.options_type === false);
    // 건조기 필수 옵션들
    const dryingRequiredOptions = options.filter(opt => opt.machine_type === false && opt.options_type === true);
    // 건조기 선택 옵션들
    const dryingOptionalOptions = options.filter(opt => opt.machine_type === false && opt.options_type === false);

    // 각 매장마다 12개의 기계 생성 (세탁기 8개, 건조기 4개)
    for (let storeIndex = 0; storeIndex < stores.length; storeIndex++) {
      const store = stores[storeIndex];
      const storeOwner = users[6 + (storeIndex % 4)]; // storeowner1-4 순환

      // 각 매장에 세탁기 8개 생성
      for (let i = 0; i < 8; i++) {
        const machine = this.machineRepo.create({
          store: store,
          user: storeOwner,
          machine_type: true, // 세탁기
        });
        
        const savedMachine = await this.machineRepo.save(machine);
        
        // 세탁기 옵션들 설정 (필수 옵션 모두 + 선택 옵션 2-3개 랜덤)
        const machineOptions: MachineOptions[] = [];
        
        // 모든 필수 옵션 추가
        machineOptions.push(...washingRequiredOptions);
        
        // 선택 옵션 중 2-3개 랜덤 선택
        const shuffledOptional = washingOptionalOptions.sort(() => Math.random() - 0.5);
        const randomCount = Math.floor(Math.random() * 2) + 2; // 2-3개
        machineOptions.push(...shuffledOptional.slice(0, randomCount));
        
        // 옵션들 저장
        savedMachine.options = machineOptions;
        await this.machineRepo.save(savedMachine);
        
        machines.push(savedMachine);
      }

      // 각 매장에 건조기 4개 생성
      for (let i = 0; i < 4; i++) {
        const machine = this.machineRepo.create({
          store: store,
          user: storeOwner,
          machine_type: false, // 건조기
        });
        
        const savedMachine = await this.machineRepo.save(machine);
        
        // 건조기 옵션들 설정 (필수 옵션 모두 + 선택 옵션 2-3개 랜덤)
        const machineOptions: MachineOptions[] = [];
        
        // 모든 필수 옵션 추가
        machineOptions.push(...dryingRequiredOptions);
        
        // 선택 옵션 중 2-3개 랜덤 선택
        const shuffledOptional = dryingOptionalOptions.sort(() => Math.random() - 0.5);
        const randomCount = Math.floor(Math.random() * 2) + 2; // 2-3개
        machineOptions.push(...shuffledOptional.slice(0, randomCount));
        
        // 옵션들 저장
        savedMachine.options = machineOptions;
        await this.machineRepo.save(savedMachine);
        
        machines.push(savedMachine);
      }
    }

    return machines;
  }

  private async seedReservations(stores: Store[], users: Auth[], machines: Machine[]): Promise<Reservation[]> {
    const reservationsData = [
      {
        store: stores[0],
        user: users[1],
        machine: machines[0],
        reservation_create_time: '2024-08-25 10:00:00',
        reservation_start_time: '2024-08-25 14:00:00',
        reservation_end_time: '2024-08-25 14:40:00',
        reservation_cancel: false,
      },
      {
        store: stores[1],
        user: users[2],
        machine: machines[1],
        reservation_create_time: '2024-08-25 11:00:00',
        reservation_start_time: '2024-08-25 15:00:00',
        reservation_end_time: '2024-08-25 15:50:00',
        reservation_cancel: false,
      },
      {
        store: stores[2],
        user: users[3],
        machine: machines[2],
        reservation_create_time: '2024-08-25 12:00:00',
        reservation_start_time: '2024-08-25 16:00:00',
        reservation_end_time: '2024-08-25 16:30:00',
        reservation_cancel: false,
      },
      {
        store: stores[3],
        user: users[4],
        machine: machines[3],
        reservation_create_time: '2024-08-25 13:00:00',
        reservation_start_time: '2024-08-25 17:00:00',
        reservation_end_time: '2024-08-25 18:00:00',
        reservation_cancel: false,
      },
      {
        store: stores[4],
        user: users[5],
        machine: machines[4],
        reservation_create_time: '2024-08-25 14:00:00',
        reservation_start_time: '2024-08-25 18:00:00',
        reservation_end_time: '2024-08-25 18:45:00',
        reservation_cancel: false,
      },
      {
        store: stores[5],
        user: users[1],
        machine: machines[5],
        reservation_create_time: '2024-08-25 15:00:00',
        reservation_start_time: '2024-08-25 19:00:00',
        reservation_end_time: '2024-08-25 19:35:00',
        reservation_cancel: false,
      },
      {
        store: stores[6],
        user: users[2],
        machine: machines[6],
        reservation_create_time: '2024-08-25 16:00:00',
        reservation_start_time: '2024-08-25 20:00:00',
        reservation_end_time: '2024-08-25 20:30:00',
        reservation_cancel: false,
      },
      {
        store: stores[7],
        user: users[3],
        machine: machines[7],
        reservation_create_time: '2024-08-25 17:00:00',
        reservation_start_time: '2024-08-25 21:00:00',
        reservation_end_time: '2024-08-25 21:45:00',
        reservation_cancel: true, // 취소된 예약
      },
      {
        store: stores[8],
        user: users[4],
        machine: machines[8],
        reservation_create_time: '2024-08-26 08:00:00',
        reservation_start_time: '2024-08-26 10:00:00',
        reservation_end_time: '2024-08-26 10:40:00',
        reservation_cancel: false,
      },
      {
        store: stores[9],
        user: users[5],
        machine: machines[9],
        reservation_create_time: '2024-08-26 09:00:00',
        reservation_start_time: '2024-08-26 11:00:00',
        reservation_end_time: '2024-08-26 11:25:00',
        reservation_cancel: false,
      },
    ];

    const reservations: Reservation[] = [];
    for (const reservationData of reservationsData) {
      const reservation = this.reservationRepo.create(reservationData);
      const savedReservation = await this.reservationRepo.save(reservation);
      reservations.push(savedReservation);
    }

    return reservations;
  }

  private async seedReviews(stores: Store[], users: Auth[], machines: Machine[], reservations: Reservation[]): Promise<Review[]> {
    const reviewsData = [
      {
        reservation: reservations[0],
        store: stores[0],
        user: users[1],
        machine: machines[0],
        rating: '5',
        review_contents: '매우 깨끗하고 빠르게 세탁되었습니다. 직원분들도 친절하세요!',
        review_create_time: '2024-08-25 15:00:00',
        review_cancel: false,
      },
      {
        reservation: reservations[1],
        store: stores[1],
        user: users[2],
        machine: machines[1],
        rating: '4',
        review_contents: '건조기 성능이 좋네요. 다만 가격이 조금 비싼 것 같아요.',
        review_create_time: '2024-08-25 16:00:00',
        review_cancel: false,
      },
      {
        reservation: reservations[2],
        store: stores[2],
        user: users[3],
        machine: machines[2],
        rating: '3',
        review_contents: '24시간 운영이라 좋지만 시설이 조금 오래된 것 같아요.',
        review_create_time: '2024-08-25 17:00:00',
        review_cancel: false,
      },
      {
        reservation: reservations[3],
        store: stores[3],
        user: users[4],
        machine: machines[3],
        rating: '5',
        review_contents: '잠실점은 정말 깨끗하고 최신 기계들이에요. 추천합니다!',
        review_create_time: '2024-08-25 18:30:00',
        review_cancel: false,
      },
      {
        reservation: reservations[4],
        store: stores[4],
        user: users[5],
        machine: machines[4],
        rating: '4',
        review_contents: '이태원점 위치가 좋고 스니커즈 세탁 코스가 유용해요.',
        review_create_time: '2024-08-25 19:00:00',
        review_cancel: false,
      },
      {
        reservation: reservations[5],
        store: stores[5],
        user: users[1],
        machine: machines[5],
        rating: '5',
        review_contents: '명동점 서비스 최고! 직원분이 세심하게 챙겨주세요.',
        review_create_time: '2024-08-25 20:00:00',
        review_cancel: false,
      },
      {
        reservation: reservations[6],
        store: stores[6],
        user: users[2],
        machine: machines[6],
        rating: '3',
        review_contents: '건대점은 학생들이 많아서 대기시간이 좀 있어요.',
        review_create_time: '2024-08-25 21:00:00',
        review_cancel: false,
      },
      {
        reservation: reservations[8],
        store: stores[8],
        user: users[4],
        machine: machines[8],
        rating: '4',
        review_contents: '노원점 셀프서비스가 편리하고 가격도 합리적이에요.',
        review_create_time: '2024-08-26 11:00:00',
        review_cancel: false,
      },
      {
        reservation: reservations[9],
        store: stores[9],
        user: users[5],
        machine: machines[9],
        rating: '5',
        review_contents: '성수점 새로 오픈한 곳인데 시설이 정말 좋아요!',
        review_create_time: '2024-08-26 12:00:00',
        review_cancel: false,
      },
      {
        reservation: reservations[0],
        store: stores[0],
        user: users[3],
        machine: machines[0],
        rating: '4',
        review_contents: '강남점 재방문했는데 역시 만족스러워요.',
        review_create_time: '2024-08-26 13:00:00',
        review_cancel: false,
      },
    ];

    const reviews: Review[] = [];
    for (const reviewData of reviewsData) {
      const review = this.reviewRepo.create(reviewData);
      const savedReview = await this.reviewRepo.save(review);
      reviews.push(savedReview);
    }

    return reviews;
  }

  private async seedReviewComments(reviews: Review[], stores: Store[], users: Auth[], machines: Machine[], reservations: Reservation[]): Promise<void> {
    const commentsData = [
      {
        review: reviews[0],
        reservation: reservations[0],
        store: stores[0],
        user: users[6], // 매장 사장님 답글
        machine: machines[0],
        review_comment_contents: '이용해주셔서 감사합니다! 항상 깨끗한 서비스로 보답하겠습니다.',
        review_comment_create_time: '2024-08-25 15:30:00',
        review_comment_cancel: false,
      },
      {
        review: reviews[1],
        reservation: reservations[1],
        store: stores[1],
        user: users[7], // 매장 사장님 답글
        machine: machines[1],
        review_comment_contents: '소중한 의견 감사합니다. 가격 정책을 다시 검토해보겠습니다.',
        review_comment_create_time: '2024-08-25 16:30:00',
        review_comment_cancel: false,
      },
      {
        review: reviews[2],
        reservation: reservations[2],
        store: stores[2],
        user: users[8], // 매장 사장님 답글
        machine: machines[2],
        review_comment_contents: '시설 개선을 위해 노력하고 있습니다. 다음에 더 좋은 서비스로 뵙겠습니다.',
        review_comment_create_time: '2024-08-25 17:30:00',
        review_comment_cancel: false,
      },
      {
        review: reviews[3],
        reservation: reservations[3],
        store: stores[3],
        user: users[9], // 매장 사장님 답글
        machine: machines[3],
        review_comment_contents: '추천해주셔서 감사합니다! 항상 최선을 다하겠습니다.',
        review_comment_create_time: '2024-08-25 19:00:00',
        review_comment_cancel: false,
      },
      {
        review: reviews[4],
        reservation: reservations[4],
        store: stores[4],
        user: users[6], // 매장 사장님 답글
        machine: machines[4],
        review_comment_contents: '스니커즈 세탁 전문 서비스를 좋게 봐주셔서 감사합니다.',
        review_comment_create_time: '2024-08-25 19:30:00',
        review_comment_cancel: false,
      },
      {
        review: reviews[5],
        reservation: reservations[5],
        store: stores[5],
        user: users[7], // 매장 사장님 답글
        machine: machines[5],
        review_comment_contents: '직원 칭찬 감사합니다. 더욱 세심한 서비스로 보답하겠습니다.',
        review_comment_create_time: '2024-08-25 20:30:00',
        review_comment_cancel: false,
      },
      {
        review: reviews[6],
        reservation: reservations[6],
        store: stores[6],
        user: users[8], // 매장 사장님 답글
        machine: machines[6],
        review_comment_contents: '대기시간 단축을 위해 기계를 추가 설치할 예정입니다.',
        review_comment_create_time: '2024-08-25 21:30:00',
        review_comment_cancel: false,
      },
      {
        review: reviews[7],
        reservation: reservations[8],
        store: stores[8],
        user: users[6], // 매장 사장님 답글
        machine: machines[8],
        review_comment_contents: '셀프서비스를 편리하게 이용해주셔서 감사합니다.',
        review_comment_create_time: '2024-08-26 11:30:00',
        review_comment_cancel: false,
      },
      {
        review: reviews[8],
        reservation: reservations[9],
        store: stores[9],
        user: users[7], // 매장 사장님 답글
        machine: machines[9],
        review_comment_contents: '새로 오픈한 매장을 좋게 봐주셔서 감사합니다!',
        review_comment_create_time: '2024-08-26 12:30:00',
        review_comment_cancel: false,
      },
      {
        review: reviews[9],
        reservation: reservations[0],
        store: stores[0],
        user: users[6], // 매장 사장님 답글
        machine: machines[0],
        review_comment_contents: '재방문해주셔서 정말 감사합니다. 앞으로도 좋은 서비스 약속드려요.',
        review_comment_create_time: '2024-08-26 13:30:00',
        review_comment_cancel: false,
      },
    ];

    for (const commentData of commentsData) {
      const comment = this.reviewCommentRepo.create(commentData);
      await this.reviewCommentRepo.save(comment);
    }
  }

  private async seedFavStores(users: Auth[], stores: Store[]): Promise<void> {
    const favStoresData = [
      { user: users[1], store: stores[0], favStoreCancel: false },
      { user: users[1], store: stores[1], favStoreCancel: false },
      { user: users[2], store: stores[0], favStoreCancel: false },
      { user: users[2], store: stores[2], favStoreCancel: false },
      { user: users[3], store: stores[1], favStoreCancel: false },
      { user: users[3], store: stores[3], favStoreCancel: false },
      { user: users[4], store: stores[2], favStoreCancel: false },
      { user: users[4], store: stores[4], favStoreCancel: false },
      { user: users[5], store: stores[3], favStoreCancel: false },
      { user: users[5], store: stores[5], favStoreCancel: false },
    ];

    for (const favStoreData of favStoresData) {
      const favStore = this.favStoreRepo.create(favStoreData);
      await this.favStoreRepo.save(favStore);
    }
  }

  private async seedStoreNoticeEvents(stores: Store[], users: Auth[]): Promise<void> {
    // 각 매장마다 15개씩 생성 (공지 5개 + 종료된 이벤트 8개 + 진행중 이벤트 2개)
    for (let storeIndex = 0; storeIndex < stores.length; storeIndex++) {
      const store = stores[storeIndex];
      const storeOwner = users[6 + (storeIndex % 4)]; // storeowner1-4 순환

      // 공지사항 5개 생성
      const noticesData = [
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: true, // 공지사항
          store_notice_event_title: '시설 개선 공지',
          store_notice_event_contents: '더 나은 서비스를 위해 세탁기 2대를 교체했습니다. 이용에 참고해주세요.',
          store_notice_event_create_time: '2024-08-25 09:00:00',
          store_notice_event_start_time: '2024-08-25 09:00:00',
          store_notice_event_end_time: '2025-12-31 23:59:59',
          store_notice_event_image_url: undefined,
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: true, // 공지사항
          store_notice_event_title: '정기 점검 안내',
          store_notice_event_contents: '매월 첫째 주 월요일 오전 6시-8시는 정기 점검 시간입니다.',
          store_notice_event_create_time: '2024-08-20 08:00:00',
          store_notice_event_start_time: '2024-08-20 08:00:00',
          store_notice_event_end_time: '2025-12-31 23:59:59',
          store_notice_event_image_url: undefined,
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: true, // 공지사항
          store_notice_event_title: '운영시간 변경 안내',
          store_notice_event_contents: '9월부터 운영시간이 오전 7시 30분으로 변경됩니다.',
          store_notice_event_create_time: '2024-08-15 09:00:00',
          store_notice_event_start_time: '2024-08-15 09:00:00',
          store_notice_event_end_time: '2025-09-01 00:00:00',
          store_notice_event_image_url: undefined,
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: true, // 공지사항
          store_notice_event_title: '야간 무인 운영 안내',
          store_notice_event_contents: '밤 11시부터 아침 6시까지는 무인으로 운영됩니다. 카드 결제만 가능합니다.',
          store_notice_event_create_time: '2024-08-10 09:00:00',
          store_notice_event_start_time: '2024-08-10 09:00:00',
          store_notice_event_end_time: '2025-12-31 23:59:59',
          store_notice_event_image_url: undefined,
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: true, // 공지사항
          store_notice_event_title: '고객 안전 수칙 안내',
          store_notice_event_contents: '세탁 시 안전을 위해 포켓 확인 및 세탁 표시를 꼭 확인해주세요.',
          store_notice_event_create_time: '2024-08-05 10:00:00',
          store_notice_event_start_time: '2024-08-05 10:00:00',
          store_notice_event_end_time: '2025-12-31 23:59:59',
          store_notice_event_image_url: undefined,
        },
      ];

      // 종료된 이벤트 8개 생성
      const endedEventsData = [
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '신규 회원 할인 이벤트',
          store_notice_event_contents: '첫 이용 고객에게 30% 할인 혜택을 드립니다!',
          store_notice_event_create_time: '2024-07-01 10:00:00',
          store_notice_event_start_time: '2024-07-01 10:00:00',
          store_notice_event_end_time: '2024-07-31 23:59:59',
          store_notice_event_image_url: 'https://example.com/event-banner.jpg',
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '여름 특가 이벤트',
          store_notice_event_contents: '7월 한 달간 대용량 세탁 20% 할인! 이불, 이불커버 등 큰 세탁물도 저렴하게!',
          store_notice_event_create_time: '2024-06-25 09:00:00',
          store_notice_event_start_time: '2024-07-01 00:00:00',
          store_notice_event_end_time: '2024-07-31 23:59:59',
          store_notice_event_image_url: 'https://example.com/summer-sale.jpg',
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '스니커즈 세탁 출시 기념',
          store_notice_event_contents: '새로운 스니커즈 전용 세탁 서비스 출시! 한 달간 50% 할인',
          store_notice_event_create_time: '2024-06-15 09:00:00',
          store_notice_event_start_time: '2024-06-15 09:00:00',
          store_notice_event_end_time: '2024-07-15 23:59:59',
          store_notice_event_image_url: 'https://example.com/sneaker-wash.jpg',
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '봄맞이 대청소 이벤트',
          store_notice_event_contents: '봄맞이 대청소 시즌! 커튼, 카펫 세탁 30% 할인 이벤트',
          store_notice_event_create_time: '2024-04-01 09:00:00',
          store_notice_event_start_time: '2024-04-01 09:00:00',
          store_notice_event_end_time: '2024-04-30 23:59:59',
          store_notice_event_image_url: 'https://example.com/spring-cleaning.jpg',
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '학기 시작 맞이 이벤트',
          store_notice_event_contents: '신학기 맞이 학생 할인! 학생증 제시 시 20% 할인',
          store_notice_event_create_time: '2024-02-20 09:00:00',
          store_notice_event_start_time: '2024-03-01 09:00:00',
          store_notice_event_end_time: '2024-03-31 23:59:59',
          store_notice_event_image_url: 'https://example.com/student-discount.jpg',
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '겨울 이불 세탁 특가',
          store_notice_event_contents: '겨울 이불, 패딩 세탁 특가! 25% 할인된 가격으로',
          store_notice_event_create_time: '2024-01-15 09:00:00',
          store_notice_event_start_time: '2024-01-15 09:00:00',
          store_notice_event_end_time: '2024-02-29 23:59:59',
          store_notice_event_image_url: 'https://example.com/winter-bedding.jpg',
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '신년 맞이 감사 이벤트',
          store_notice_event_contents: '2024년 신년을 맞아 모든 서비스 15% 할인!',
          store_notice_event_create_time: '2023-12-28 09:00:00',
          store_notice_event_start_time: '2024-01-01 00:00:00',
          store_notice_event_end_time: '2024-01-31 23:59:59',
          store_notice_event_image_url: 'https://example.com/new-year.jpg',
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '크리스마스 특별 이벤트',
          store_notice_event_contents: '크리스마스 특별 할인! 12월 한 달간 10% 추가 할인',
          store_notice_event_create_time: '2023-11-25 09:00:00',
          store_notice_event_start_time: '2023-12-01 00:00:00',
          store_notice_event_end_time: '2023-12-31 23:59:59',
          store_notice_event_image_url: 'https://example.com/christmas.jpg',
        },
      ];

      // 진행중인 이벤트 2개 생성 (현재 날짜 기준으로 진행중)
      const ongoingEventsData = [
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '🔥 8월 마지막주 빅세일!',
          store_notice_event_contents: '8월 마지막주 대박 세일! 모든 세탁 서비스 35% 할인! 놓치지 마세요!',
          store_notice_event_create_time: '2025-08-20 09:00:00',
          store_notice_event_start_time: '2025-08-25 00:00:00',
          store_notice_event_end_time: '2025-08-31 23:59:59',
          store_notice_event_image_url: 'https://example.com/august-big-sale.jpg',
        },
        {
          store: store,
          user: storeOwner,
          store_notice_event_type: false, // 이벤트
          store_notice_event_title: '⭐ 고객감사 포인트 2배 적립',
          store_notice_event_contents: '고객 감사의 마음을 담아 포인트 2배 적립! 9월 중순까지 계속됩니다!',
          store_notice_event_create_time: '2025-08-15 10:00:00',
          store_notice_event_start_time: '2025-08-20 00:00:00',
          store_notice_event_end_time: '2025-09-15 23:59:59',
          store_notice_event_image_url: 'https://example.com/point-double.jpg',
        },
      ];

      // 모든 데이터를 합쳐서 저장
      const allNoticeEvents = [...noticesData, ...endedEventsData, ...ongoingEventsData];

      for (const noticeEventData of allNoticeEvents) {
        const noticeEvent = this.storeNoticeEventRepo.create(noticeEventData);
        await this.storeNoticeEventRepo.save(noticeEvent);
      }
    }
  }
}
