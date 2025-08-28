# 🐳 LaundryTalk Backend - Docker Setup

## 📦 **Docker 사용법**

### **🚀 프로덕션 환경 실행**

```bash
# 1. 이미지 빌드 및 실행
docker-compose up -d

# 2. 로그 확인
docker-compose logs -f app

# 3. 종료
docker-compose down
```

### **🛠️ 개발 환경 실행**

```bash
# 1. 개발 환경 실행 (핫 리로드 지원)
docker-compose -f docker-compose.dev.yml up -d

# 2. 로그 확인
docker-compose -f docker-compose.dev.yml logs -f app-dev

# 3. 종료
docker-compose -f docker-compose.dev.yml down
```

### **🔧 개별 명령어**

```bash
# Docker 이미지만 빌드
docker build -t laundry-backend .

# 컨테이너 단독 실행
docker run -p 3000:3000 laundry-backend

# PostgreSQL만 실행
docker-compose up postgres

# 데이터베이스 초기화
docker-compose down -v  # 볼륨까지 삭제
docker-compose up -d
```

## 📋 **시스템 요구사항**

### **버전 정보**
- **Node.js**: v22.17.0
- **npm**: v10.9.2
- **PostgreSQL**: v17-alpine
- **Docker**: Latest
- **Docker Compose**: v3.8+

## 📋 **접속 정보**

### **프로덕션**
- **Backend API**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432

### **개발환경**
- **Backend API**: http://localhost:3001/api
- **PostgreSQL**: localhost:5433

## 🔒 **환경변수 설정**

`docker-compose.yml`에서 다음 환경변수를 수정하세요:

```yaml
environment:
  # Gmail 설정
  MAIL_USER: your-email@gmail.com
  MAIL_PASS: your-app-password
  
  # JWT 시크릿 (프로덕션에서는 반드시 변경)
  JWT_SECRET: your-secret-key
  
  # 프론트엔드 URL
  FRONTEND_URL: http://your-frontend-domain.com
```

## 🩺 **헬스체크**

```bash
# 컨테이너 상태 확인
docker-compose ps

# 헬스체크 상태 확인
docker inspect laundry_backend | grep Health -A 10
```

## 📊 **로그 관리**

```bash
# 실시간 로그 확인
docker-compose logs -f

# 특정 서비스 로그만
docker-compose logs -f app

# 로그 파일 크기 제한
docker-compose logs --tail=100 app
```

## 🧹 **정리 명령어**

```bash
# 컨테이너 및 이미지 정리
docker-compose down --rmi all

# 볼륨까지 모두 삭제
docker-compose down -v --rmi all

# 사용하지 않는 Docker 리소스 정리
docker system prune -a
```

## 🔄 **업데이트**

```bash
# 코드 변경 후 재빌드
docker-compose build --no-cache
docker-compose up -d
```
