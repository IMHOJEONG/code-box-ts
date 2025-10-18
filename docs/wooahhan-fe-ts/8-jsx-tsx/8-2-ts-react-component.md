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
type Option = Record<string, string>;

interface SelectProps {
    options: Option;
    selectedOption?: string;
    onChange?: (selected?: string) => void
}

const Select = ({ options, selectedOption, onChange }: SelectProps): JSX.Element => // .... 
```

`[key: string]은 사실상 모든 키값을 가질 수 있음을 의미, 넓은 범위의 타입은 해당 타입을 사용하는 함수에 잘못된 타입이 전달될 수 있기 때문`

- `가능한 한 타입을 좁게 제한하여 사용할 것`