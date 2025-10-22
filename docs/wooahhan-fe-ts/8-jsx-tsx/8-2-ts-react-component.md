## 8.2 TS로 리액트 컴포넌트 만들기 

- 리액트 프로젝트에서 공통 컴포넌트에 어떤 타입의 속성(프로퍼티)이 제공되어야 하는지 알려줌 

- 필수로 전달되어야 하는 속성이 전달되지 않았을 때는 에러를 표시하여 유지보수 과정에서 발생할 수 있는 다양한 실수를 사전에 막을 수 있게 해줌 

```ts 

```

### 2. JSDocs로 일부 타입 지정하기 

- 컴포넌트의 속성 타입을 명시하기 위해 JSDocs를 사용할 수 있음 

    - JSDocs를 활용하면, 활용하면 컴포넌트에 대한 설명, 역할을 간단히 알려줄 수 있음 

### 3. props 인터페이스 적용하기 

- JSDocs = 각 속성의 대략적인 타입, 어떤 역할을 하는지 파악 가능 

- options가 어떤 형식의 객체를 나타내는지 또는 onChange의 매개변수 및 반환 값에 대한 구체적인 정보를 알기 쉽지 않아서, 잘못된 타입이 전달될 수 있는 위험이 존재

    - TS를 사용해 좀 더 정교하고 구체적인 타입 지정 가능 

```ts
// 1. Option이라는 타입 정의
type Option = Record<string, string>;


// SelectProps에서 이 타입을 재사용
interface SelectProps {
    options: Option;
    selectedOption?: string;
    // 선택된 string 값 또는 undefined 을 매개변수로 받고 어떤 값도 반환하지 않는(void) 함수임을 명확히 표현 
    // onChange - 선택적 속성이기 때문에, 부모 컴포넌트에서 넘겨주지 않아도 해당 컴포넌트를 사용할 수 있음 
    onChange?: (selected?: string) => void
}

const Select = ({ options, selectedOption, onChange }: SelectProps): JSX.Element => // .... 
```

- Record는 key, value의 타입이 모두 string인 객체 타입을 생성하는 유틸리티 타입으로 사용됨 

    - options의 타입을 정의해줌으로써 string이 아닌 배열이나 다른 유형의 value를 가진 객체는 전달할 수 없게 됨 

`[key: string]은 사실상 모든 키값을 가질 수 있음을 의미, 넓은 범위의 타입은 해당 타입을 사용하는 함수에 잘못된 타입이 전달될 수 있기 때문`

- `가능한 한 타입을 좁게 제한하여 사용할 것`

```ts
interface Fruit {
    count: number;
}

interface Param {
    [key: string]: Fruit; // type Param = Record<string, Fruit>
}

const func: (fruits: Param) => void = ({ apple }: Param) => {
    console.log(apple.count)
}

// OK
func({ apple: { count: 0 }});

// Runtime Error 
func({ mango: { count: 0 }});

```

### 리액트 이벤트 

- 리액트는 가상 DOM을 다루면서 이벤트도 별도로 관리 

    - 리액트 컴포넌트(노드)에 등록되는 이벤트 리스너는 onClick, onChange처럼 카멜 케이스로 표기 

    - 리액트 이벤트는 브라우저의 고유한 이벤트와 완전히 동일하게 동작하지는 않음 

- 예: 리액트 이벤트 핸들러는 이벤트 버블링 단계에서 호출됨 

    - 이벤트 캡처 단계에서 이벤트 핸들러를 등록하려면? onClickCapture, onChangeCapture와 같이 일반 이벤트 리스너 이름 뒤 Capture를 붙여야 함 
    
- 리액트는 브라우저 이벤트를 합성한 합성 이벤트(SyntheticEvent)를 제공

```ts
type EventHandler<Event extends React.SyntheticEvent> = (e: Event) => void | null;
type ChangeEventHandler = EventHandler<ChangeEvent<HTMLSelectElement>>;

const eventHandler1: GlobalEventHandlers["onchange"] = (e) => {
    e.target // 일반 Event는 target이 없음 
}

const eventHandler2: ChangeEventHandler = (e) => {
    e.target // 리액트 이벤트(합성 이벤트)는 target이 있음 
}
```

- 리액트에서 제공하는 기본 컴포넌트도 SelectProps처럼 각각 props에 대한 타입을 명시해두고 있음 

    - 리액트 컴포넌트에 연결할 이벤트 핸들러도 해당 타입을 일치시켜줘야 함 

- React.ChangeEventHandler<HTMLSelectElement> 타입 = React.EventHandler<ChangeEvent<HTMLSelectElement>>와 동일한 타입 

```ts
const Select = ({
    onChange, options, selectedOption
}: SelectProps) => {

    // ChangeEventHandler<HTMLSelectElement> 타입의 이벤트를 매개변수로 받아, 해당 이벤트를 처리하는 핸들러를 작성 
    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const selected = Object.entries(options).find(
            ([_, value]) => value === e.target.value
        )?.[0];

        onChange?.(selected);
    }

    return (
        // onChange는 HTML select 엘리먼트에서 발생하는 change 이벤트에 대한 핸들러로 선언됨 
        // 
        <select onChange={handleChange}>
            // 
        </select>
    )

}
```

### 훅에 타입 추가

- useState 같은 함수 역시 타입 매개변수를 지정 - state 타입을 지정 가능 

    - 제네릭 타입을 명시하지 않으면 TS 컴파일러는 초깃값(default value)의 타입을 기반으로 state 타입을 추론

```ts

type Fruit = keyof typeof fruits;
const [fruit, changeFruit] = useState<Fruit | undefined>("apple");

const func = () => {
    changeFruit("???")
}
```

`keyof typeof obj` 

- 해당 객체의 키값을 유니온 타입으로 추출하는 패턴으로 자주 사용됨

- 훅이나 외부 라이브러리 또는 내부 모듈의 함수는 적절한 제네릭 타입을 설정해 활용 가능 

- string, number, boolean 같은 원시 타입은 자동으로 추론되므로 생략 가능 


