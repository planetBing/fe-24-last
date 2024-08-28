# **노션**

<br>

# 🙋‍♂️ **멤버**

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/planetBing">
        <img src="https://avatars.githubusercontent.com/u/150240792?v=4" width="150px;" alt="정채영 프로필 사진"/><br />
        <sub><b>정채영(FE)</b><br></sub>
      </a>
    </td>
    </tr>
</table>

<br>

# 📚 **개발 포인트**

<details>
<summary>데이터 구조</summary>
<div markdown="1">

</div>
</details>

<br/>

# 🖥 **시작하기**

### **1. 세팅**

```bash
git clone https://github.com/planetBing/fe-24-last.git

cd server
npm install

cd client
npm install
```

### **2. 실행**

```bash
# /fe-notion/server
npm start

# /fe-notion/client
npm run dev
```

<br>

# 📦 **주요 기능**

### ⭐️ 페이지 생성 기능

- 사이드바 최상단의 글 작성 버튼 클릭 시 새로운 페이지 생성
- 사이드바의 페이지 제목 hover시 나타나는 우측의 `+` 버튼 클릭 시 하위 페이지 생성
- (예정) 블록에 `/` 입력 후 페이지 버튼을 누르면 새로운 하위 페이지 생성

### ⭐️ 글 편집 기능

- 엔터를 누르거나 페이지 하단의 비어있는 영역을 마우스로 클릭했을 때 새로운 영역 생성
- 블록 hover 시 나타나는 좌측의 버튼을 클릭하면 블록 드래그 앤 드롭 가능
  - 새로운 열과 행 생성 가능
- 블록에 `/`를 입력하면 블록의 타입 지정 가능
  - 일반 텍스트, 페이지, 제목, 글머리 기호
- 빈 블록에 Backspace 입력 시 블록 삭제

### ⭐️ 페이지 삭제 기능

- 사이드바의 페이지 제목 hover 시 나타나는 우측의 `-` 버튼 클릭 시 해당 페이지와 그의 자식 페이지들이 모두 삭제됨
