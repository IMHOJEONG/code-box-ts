## 7.1 api 요청 

### 7.1.1 fetch api 요청 

- 새로운 api 요청 정책이 추가될 때마다, 계속해서 비동기 호출 코드를 수정해야 하는 번거로움 존재 

### 7.2.2 서비스 레이어로 분리하기 

- 여러 API 요청 정책이 추가되어 코드가 변경될 수 있다는 것을 감안 
    - 비동기 호출 코드는 컴포넌트 영역에서 분리되어 다른 영역(서비스 레이어)에서 처리되어야 함 

- fetch 함수를 호출하는 부분 = 서비스 레이어로 이동 

    - 컴포넌트는 서비스 레이어의 비동기 함수를 호출해 그 결과를 받아와 렌더링하는 흐름 

- fetch 함수를 분리하는 것만으로 API 요청 정책이 추가된은 것을 해결하기 어려움 

    - query parameter, custom header, cookie를 읽어 토큰을 집어넣는 등 다양한 api 정책 추가를 모두 구현하는 것은 번거로움 

### 7.2.3 Axios 활용하기 

- fetch가 많은 기능을 사용하려면 직접 구현해서 사용해야 함 

```ts
const apiRequester: AxiosInstance = axios.create({
    baseURL: "",
    timeout: 5000
})

const fetchCart = (): AxiosPromise<FetchCartResponse> => apiRequester.get<FetchCartResponse>("cart");

const postCart = (postCartRequest: PostCartRequest): AxiosPromise<PostCartResponse> => apiRequester.post<PostCartResponse>("cart", postCartRequest);
```

- API Entry가 2개 이상일 경우, 각 서버의 기본 URL을 호출하도록 2개 이상의 API 요청을 처리하는 인스턴스를 따로 구성해야 함 

```ts
const apiRequester: AxiosInstance = axios.create(defaultConfig);

const orderApiRequester: AxiosInstance = axios.create({
    baseURL: "https://api.baemin.or/",
    ...defaultConfig
});

const orderCartApiRequester: AxiosInstance = axios.create({
    baseURL: "https://cart.baemin.order/",
    ...defaultConfig
});
```

### 7.2.4 Axios 인터셉터 사용하기 

- 각각의 requester는 서로 다른 역할을 담당하는 다른 서버 -> requester별로 다른 헤더를 설정해줘야 하는 로직이 필요한 경우가 있음 

    - 인터셉터 기능을 사용해, requester에 따라 비동기 호출 내용을 추가해서 처리 가능 

    - API 에러를 처리할 때 하나의 에러 객체로 묶어서 처리 가능 

```ts

```

- 요청 옵션에 따라 다른 intercepter를 만들기 위해 빌더 패턴을 추가해, APIBuilder 같은 클래스 형태로 구성하기도 함 

- 빌더 패턴: 객체 생성을 더 편리하고 가독성 있게 만들기 위한 디자인 패턴 중 하나 

    - 복잡한 객체의 생성을 단순화 & 객체 생성 과정을 분리해 객체를 조립하는 방법을 제공 

### 7.2.5 API 응답 지정하기 

- 같은 서버에서 오는 응답의 형태는 대체로 통일 = 하나의 Response 타입으로 묶일 수 있음 

- Response 타입은 apiRequester가 모르게 관리되어야 함 

    - API 요청 및 응답 값 중에는 하나의 API 서버에서 다른 API 서버로 넘겨주기만 하는 값도 존재할 수 있음 

    - 해당 값에 어떤 응답이 들어있는지 알 수 없거나, 값의 형식이 달라지더라도 로직에 영향을 주지 않는 경우엔

        - unknown 타입을 사용해 알수 없는 값임을 표현한다 

```ts 

// forPass 안 프론트 로직에서 사용해야 하는 값이 있다면, 여전히 어떤 값이 들어올지 모르는 상태 -> unknown을 유지 
interface response {
    data: {
        cartItems: CartItem[];
        forPass: unknown;
    }
}

// ---- 
type ForPass = {
    type: "A" | "B" | "C"
};

const isTargetValue = () => (data.forPass as ForPass).type === "A";


```

- 로그를 위해 단순히 받아서 넘겨주는 값의 타입은 언제든지 변경될 수 있음 

    - forPass 내의 값을 사용하지 않아야 한다.

    - 주의! 이미 설계된 프로덕트에서 쓰고 있는 값이라면, 프론트 로직에서 써야 하는 값에 대해서만 타입을 선언한 다음에 쓰는 게 좋음 

### 7.2.6 View Model 사용하기 

- API 응답은 변할 가능성이 큼, 특히 새로운 프로젝트는 서버 스펙이 자주 바뀌기 때문에 View Model을 사용해 API 변경에 따른 범위를 한정해 줘야 함 

- View Model을 만들면 API 응답이 바뀌어도 UI가 깨지지 않게 개발 가능 

    - 도메인 개념을 넣을 때, 백엔드나 UI에서 로직을 추가 처리 필요없이 간편하게 새로운 필드를 View model에 추가 가능 

- View Model의 단점 

    - 추상화 레이어는 결국 코드를 복잡하게 만들고 레이어를 관리하고 개발하는 데도 비용이 듬 

    - 서버가 내려준 응답과 클라이언트가 실제 사용하는 도메인이 다르다면, 서버와 클라이언트 간의 의사소통 문제가 생길 수 있음 

- 결국 API 응답이 바뀌었을 때, 클라이언트 코드를 수정하는 데 들어가는 비용을 줄이면서도 & 도메인의 일관성을 지킬 수 있는 절충안 필요 

    1. 꼭 필요한 곳에만 view model을 부분적으로 만들어서 사용하기 

    2. 백엔드와 클라이언트 개발자가 충분히 소통 후 개발해 API 응답 변화 최대한 줄이기 

    3. 뷰 모델에 필드를 추가하는 대신 getter 등 함수를 추가해 실제 어떤 값이 view model에 추가한 값인지 알기 쉽게 하기 등 

- 개발 단계에서는 API 응답 형식이 자주 변경됨 

    - 잘못된 타입이 전달될 가능성도 있음

    - Superstruct?? 

### 7.2.7 Superstruct를 사용해 런타임에서 응답 타입 검증하기 

- Superstruct: 런타임 응답 타입 검증을 하기 위해 사용 

- 인터페이스 정의 & JS 데이터의 유효성 검사 / 개발자와 사용자에게 자세한 런타임 에러를 보여주기 위해 고안됨 

- Article이라는 변수는 Superstruct의 object() 모듈의 반환 결과 

`실제 Superstruct 내부 로직에서 반환되는 타입은 object()의 반환 결과를 한 번 더 감싸서 내려옴`

- number(), string() 모듈의 반환 타입도 숫자, 문자열 형태라고 이해 가능 

- `assert`, `is`, `validate` 3가지 모두 데이터의 유효성 검사를 도와주는 모듈 

    - 데이터 정보를 담은 data 변수와 데이터 명세를 가진 스키마인 Article을 인자로 받아 데이터가 스키마와 부합하는지를 검사한다는 것 

    - 차이점: 모듈마다 데이터의 유효성을 다르게 접근하고 반환 값 형태가 다르다는 것 

- `assert`: 유효하지 않을 경우 에러를 던짐 

- `is`: 유효성 검사 결과에 따라 true 또는 false 즉, boolean 값을 반환한다 

- `validate`: [error, data] 형식의 튜플을 반환함, 유효하지 않을 때는 에러 값이 반환되고 유효한 경우에는 첫 번째 요소로 undefined, 두 번째 요소로 data value가 반환됨

---

### 7.2 API 상태 관리하기 

- 실제 API를 요청하는 코드 = 컴포넌트 내에서 비동기 함수를 직접 호출하지는 않음 

- 비동기 API를 호출하기 위해선, API의 성공 및 실패에 따른 상태가 관리되어야 함
    - 상태 관리 라이브러리의 액션이나 훅과 같이 재정의된 상태를 사용해야 함

### 7.2.1 상태 관리 라이브러리에서 호출 -> 스킵 

### 7.2.2 훅으로 호출하기 

- react-query나 useSwr 같은 훅을 사용한 방법
    
    - 상태 변경 라이브러리를 사용한 방식보다 훨씬 간단 (상태 관리 라이브러리에서 발생했던 의도치 않은 상태 변경 방지에 도움)
    
    - 캐시를 사용해 비동기 함수를 호출 

- 동기로 상태를 변경하는 코드가 점점 추가되면, 전역 상태 관리 스토어가 비대해짐 

    - 단순히 상태를 변경하는 액션 증가 & 전역 상태 자체도 복잡해짐 

    - 에러 발생, 로딩 중 등과 같은 상태는 전역 관리 거의 필요없음 

    - 다른 컴포넌트가 에러 상태인지, 성공 상태인지를 구독하는 경우 컴포넌트의 결합도, 복잡도가 높아져 유지보수를 어렵게 만들 수 있음 




### 7.3 API 에러 핸들링 

- 비동기 API 호출 

    - 상태 코드에 따라 401 (인증되지 않은 사용자)

    - 404 (존재하지 않는 리소스)

    - 500 (서버 내부 에러) 등 다양한 에러 발생 가능 

- 코드에서 발생할 수 있는 에러 상황에 대해 명시적인 코드를 작성

    - 유지보수 용이, 사용자에게도 구체적 에러 상황 전달 가능

#### 7.3.1 타입 가드 활용하기 

- Axios 라이브러리 = Axios 에러에 대해 isAxiosError 타입 가드를 제공 

- 서버 에러임을 명확하게 표시하고, 서버에서 내려주는 에러 응답 객체에 대해서도 구체적으로 정의 

    - 에러 객체가 어떤 속성을 가졌는지를 파악 가능 

- 서버에서 전달하는 공통 에러 객체에 대한 타입 정의

```ts 
interface ErrorResponse {
    status: string;
    serverDateTime: string; 
    errorCode: string; 
    errorMessage: string;
}
// ErrorResponse interface -> AxiosError<ErrorResponse>로 표현할 수 있음 

function isServerError(error: unknown): error is AxiosError<ErrorResponse> {
    return axios.isAxiosError(error)
}
```

- 사용자 정의 타입 가드 정의 = 타입 가드 함수의 반환 타입으로 `parameterName is Type` 형태의 타입 명제를 정의해주는 게 좋음 

    - 이 때 parameterName은 타입 가드 함수의 시그니처에 포함된 매개변수여야 함

#### 7.3.2 에러 서브클래싱하기 

- 실제 요청을 처리할 때 단순한 서버 에러도 발생

`서브클래싱`

- 기존(상위 또는 부모) 클래스를 확장해 새로운(하위 또는 자식) 클래스를 만드는 과정 

- 새로운 클래스는 상위 클래스의 모든 속성과 메서드를 상속받아 사용할 수 있고, 추가적인 속성과 메서드를 정의할 수도 있음 

```ts 
const getOrderHistory = async (page: number): Promise<History> => {
    try {
        const { data } = await axios.get(`https://some.site?page=${page}`);
        const history = await JSON.parse(data);

        return history;
    } catch (error) {
        alert(error.message);
    }
}
// 이 코드의 문제 - 개발자 입장에서는 사용자 로그인 정보가 만료되었는지, 타임아웃이 발생한 건지, 데이터를 잘못 전달한 것인지 구분할 수 없음 
```
- 서브 클래싱의 활용으로, 에러가 발생했을 때 코드상에서 어떤 에러인지를 바로 확인 가능 

    - 에러 인스턴스가 무엇인지에 따라 에러 처리 방식을 다르게 구현 가능 

    - error.ts 코드를 참고할 것 

- `error instanceof OrderHttpError`처럼 작성된 타입 가드문을 통해, 코드 상에서 에러 핸들링에 대한 부분을 한눈에 볼 수 있음 

#### 인터셉터, 에러 바운더리 활용 에러 처리 

- HTTP에 일관된 로직 적용 가능한 인터셉터 기능을 적용 

- 에러 바운더리

    - 리액트 컴포넌트 트리에서 에러가 발생할 때, 공통으로 에러를 처리하는 리액트 컴포넌트 

    - 리액트 컴포넌트 트리 하위에 있는 컴포넌트에서 발생한 에러 캐치 & 해당 에러를 가장 가까운 부모 에러 바운더리에서 처리하게 할 수 있음 

    - 에러가 발생한 컴포넌트 대신에 에러 처리를 하거나, 예상치 못한 에러를 공통 처리할 때 사용 가능 

#### 상태 관리, react-query를 활용한 에러 처리 

#### 그 밖의 에러 처리 

- API 응답: 보통 성공 시 2xx, 실패 시 4xx, 5xx 코드를 반환 

    - 일반적으로 API 요청 라이브러리에서도 HTTP 상태 코드에 따라 성공 응답인지 실패 응답인지를 판단 

- 비즈니스 로직에서의 유효성 검증에 의해 추가된 커스텀 에러는 200 응답과 함께 응답 바디에 별도 상태 코드를 전달하기도 함 

---

### 7.4 API 모킹 

- FE 개발 시, 서버 API가 완성되기 전 개발을 진행해야 하는 일이 종종 생김 

- 기획 완료 & 서버 API가 완성된 다음 FE 개발을 한 후 QA 진행한다면 좋겠지만 

    - 현실은 FE 개발이 서버 개발보다 먼저 이루어지거나 / 서버와 FE 개발이 동시에 이루어지는 경우가 많음 

- Mocking: 가짜 모듈을 활용하는 것 

    - 테스트할 때 뿐만이 아닌, 개발할 때도 사용 가능

- Mocking의 사용 = 유연한 대처 가능 

    - 서버 상태에 문제가 발생한 경우, 서버의 영향을 받지 않고, FE 개발을 할 수 있음 

- 이슈가 생겼을 때, charles 등의 도구를 활용 
    - 응답값을 그대로 복사해 이슈 발생 상황을 재현하는 데 도움이 될 수 있음 

- 참고: MSW를 사용한 팀도 존재 