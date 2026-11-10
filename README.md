# 🛡️ SecretKey Blocker (Chrome Extension)

웹 브라우저 및 AI 챗봇(ChatGPT, Claude 등) 입력창에서 실수로 민감한 **개발용 API 키가 유출되는 것을 실시간으로 차단**하는 크롬 확장 프로그램입니다.

## 🚀 프로젝트 개요
- **목적**: 개발자 및 사용자들의 API Key 무단 유출 및 오남용 사고 사전 방지
- **특징**: 백엔드 서버 없이 브라우저 클라이언트 단에서 100% 로컬 동작 (개인정보 보호 & 유지비 0원)

## 📌 v1 MVP 개발 범위 (Scope)
- [ ] **OpenAI API Key** (`sk-proj-...`, `sk-...`) 실시간 감지
- [ ] **AWS Access Key ID** (`AKIA...`) 실시간 감지
- [ ] **GitHub Personal Access Token** (`ghp_...`) 실시간 감지
- [ ] **Anthropic Claude API Key** (`sk-ant-...`) 실시간 감지
- [ ] 입력/붙여넣기 이벤트 감지 및 경고 모달 팝업 구현

## 📅 프로젝트 로드맵
- **1일차**: 아이디어 정의 및 v1 스코프 확정 (완료)
- **2일차**: 크롬 확장 프로그램 기본 폴더 구조 (Manifest V3) 세팅
- **3일차**: 정규식 패턴 스캔 컨텐츠 스크립트(Content Script) 작성
- **4일차**: 경고 모달 UI 및 전송 일시 차단 로직 구현
- **5일차**: 로컬 테스트 및 결제 링크/마켓 등록 준비
