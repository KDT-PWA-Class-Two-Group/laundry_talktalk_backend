-- PostgreSQL 17 초기 데이터베이스 설정
-- UTF-8 인코딩 설정
SET client_encoding = 'UTF8';

-- 필요한 확장 프로그램 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PostgreSQL 17의 새로운 기능 활용
-- MERGE 문 지원 (PostgreSQL 15+)
-- 향상된 JSON 기능
-- 개선된 파티셔닝

-- 데이터베이스 연결 확인
SELECT version();

-- PostgreSQL 17 최적화 설정
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;
