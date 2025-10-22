## @types/react 패키지 

- 역할이 명확한 것도 있지만, 역할이 비슷해 보이는 타입도 존재 

### 3. Children props 타입 지정 

```ts
type PropsWithChildren<P> = P & { children?: ReactNode | undefined } 
```

- 가장 보편적인 children 타입 = ReactNode | undefined 

- ReactNode = ReactElement 외에도 boolean, number 등 여러 타입을 포함하고 있는 타입 

    - 더 구체적으로 타이핑하는 용도에는 적합하지 않음 

    - ex) 특정 문자열만 허용하고 싶을 때, children에 대해 추가로 타이핑 해줘야 함 

    - children에 대한 타입 지정은 다른 prop 타입 지정과 동일하게 가능 

### 4. render 메서드, 함수 컴포넌트의 반환 타입 

- React.ReactElement vs JSX.Element vs React.ReactNode = 쉽게 헷갈릴 수 있음 

```ts
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> | 
    string 
    | JSXElementConstructor<any>
> {
    type: T; 
    props: P; 
    key: Key | null;
}
```

- React.createElement를 호출하는 형태의 구문으로 변환하면 React.createElement의 반환 타입은 ReactElement 

- 리액트는 실제 DOM이 아니라 가상의 DOM을 기반으로 렌더링함 

    - 가상 DOM의 엘리먼트는 ReactElement 형태로 저장됨 

    - ReactElement 타입 = 리액트 컴포넌트를 객체 형태로 저장하기 위한 포맷

```ts
declare global {
    namespace JSX {
        interface Element extends React.ReactElement<any, any> {}
    }
}
```

- JSX.Element = 리액트의 ReactElement를 확장하고 있는 타입 

- 글로벌 네임스페이스에 정의됨 = 외부 라이브러리에서 컴포넌트 타입을 재정의할 수 있는 유연성을 제공 (컴포넌트 타입을 재정의하거나 변경하는 것이 용이해짐)

```ts 
type ReactText = string | number; 
type ReactChild = ReactElement | ReactText; 
type ReactFragment = {} | Iterable<ReactNode>;

type ReactNode = 
    | ReactChild 
    | ReactFragment 
    | ReactPortal 
    | boolean 
    | null 
    | undefined;
``` 

- ReactNode > ReactElement > JSX.Element의 포함 관계 정의 가능 

### 2. 활용 

`ReactElement`

- JSX가 createElement 메서드를 호출하기 위한 문법 

- JSX = 리액트 엘리먼트를 생성하기 위한 문법 / 트랜스파일러 = JSX 문법을 createElement 메서드 호출문으로 변환해 리액트 엘리먼트를 생성 

```ts 
const element = React.createElement(
    "h1",
    { className: "greeting" },
    "Hello, world!"
);
```

- 리액트는 리액트 엘리먼트 객체를 읽어서 DOM을 구성 

    - 리액트에는 여러 개의 createElement 오버라이딩 메서드가 존재 -> 이 메서드들이 반환하는 타입은 ReactElement 타입을 기반으로 함 

- ReactElement 타입 = JSX의 createElement 메서드 호출로 생성된 리액트 엘리먼트를 나타내는 타입

`ReactNode` 

- ReactChild 타입 

```ts
type ReactText = string | number; 
type ReactChild = ReactElement | ReactText;
```

- ReactChild 타입 -> ReactElement | string | number로 정의되어 ReactElement보다는 좀 더 넓은 범위를 가짐 

```ts 
type ReactFragment = {} | Iterable<ReactNode>; // ReactNode의 배열 형태 
type ReactNode = 
    | ReactChild 
    | ReactFragment 
    | ReactPortal 
    | boolean | null | undefined 
```

- ReactNode는 ReactChild 외에도, boolean, null, undefined 등 훨씬 넓은 범주의 타입을 포함 

    - ReactNode = 리액트의 render 함수가 반환할 수 있는 모든 형태를 담고 있음 

`JSX.Element` 

- ReactElement의 제네릭으로 props와 타입 필드에 대해 any 타입을 가지도록 확장 

- JSX.Element는 ReactElement의 특정 타입 = props와 타입 필드를 any로 가지는 타입 

### 어떤 상황에서, 어떤 타입을?? 

- ReactNode 

    - 리액트의 render 함수가 반환할 수 있는 모든 형태를 담고 있기 때문 

```ts
interface MyComponentProps {
    children?: React.ReactNode;
}
```

- JSX 형태의 문법을 때로는 string, number, null, undefined 같이 어떤 타입이든 children prop으로 지정할 수 있게 하고 싶다면 
    - ReactNode 타입으로 children을 선언하면 됨 

- 리액트 내장 타입인 PropsWithChildren 타입도 ReactNode 타입으로 children을 선언하고 있음 

```ts
type PropsWithChildren<P = unknown> = P & {
    children?: ReactNode | undefined;
}

interface MyProps {
    // ...
}

type MyComponentProps = PropsWithChildren<MyProps>
```

- ReactNode는 prop으로 리액트 컴포넌트가 다양한 형태를 가질 수 있게 하고 싶을 때 유용하게 사용됨 

### JSX.Element 

- props와 타입 필드가 any 타입인 리액트 엘리먼트를 나타냄 

    - 리액트 엘리먼트를 prop으로 전달받아 render props 패턴으로 컴포넌트를 구현할 때 유용하게 활용 가능 

```ts 
interface Props {
    icon: JSX.Element;
}

const Item = ({ icon }: Props) => {
    const iconSize = icon.props.size;

    return (<li>{icon}</li>)
}
// icon prop을 JSX.Element 타입으로 선언해 해당 prop에는 JSX 문법만 삽입 가능 
// icon.props에 접근하여 prop으로 넘겨받은 컴포넌트의 상세한 데이터를 가져올 수 있음  
const App = () => {
    return <Item icon={<Icon size={14} />} />
}
```

### ReactElement 

- JSX.Element 예시를 확장해 추론 관점에서 더 유용하게 활용할 수 있는 방법 = JSX.Element 대신에 ReactElement를 사용

- 이때 원하는 컴포넌트의 props를 ReactElement의 제네릭으로 지정 가능 

    - 만약 JSX.Element가 ReactElement의 props 타입으로 any가 지정되었다면, ReactElement 타입을 활용하여 제네릭에 직접 해당 컴포넌트의 props 타입을 명시해준다.

```ts 
interface IconProps {
    size: number;
}

interface Props {
    // ReactElement의 props 타입으로 IconProps 타입 지정 
    icon: React.ReactElement<IconProps>
}

const Item = ({ icon }: Props) => {
    // icon prop으로 받은 컴포넌트의 props에 접근하면, props의 목록이 추론됨 
    const iconSize = icon.props.size;

    return (<li>{icon}</li>)
}
```

### 7. 리액트에서 기본 HTML 요소 타입 활용하기 

- 새롭게 만든 Button 컴포넌트 = 기존 HTML button과 같은 역할을 하면서도, 새로운 기능이나 UI가 추가된 형태 

    - 기존의 button 태그가 클릭 이벤트를 등록하기 위한 onClick 이벤트 핸들러를 지원하는 것처럼, 새롭게 만든 Button 컴포넌트도 onClick 이벤트 핸들러를 지원해야 함 

        - 일관성 & 편의성을 모두 챙기기 위함 

#### DetailedHTMLProps와 ComponentWithoutRef 

- HTML 태그의 속성 타입을 활용하는 대표적인 2가지 방법 

```ts 
// DetailedHTMLProps 
type NativeButtonProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

type ButtonProps = {
    onClick?: NativeButtonProps["onClick"]
}
//-------

// ComponentPropsWithoutRef
type NativeButtonType = React.ComponentPropsWithoutRef<"button">;

type ButtonProps = {
    onClick?: NativeButtonType["onClick"]
}
```

#### 언제 ComponentPropsWithoutRef?

- HTMLProps, ComponentPropsWithRef 등 HTML 태그의 속성을 지원하기 위한 다양한 타입 존재 

- 컴포넌트의 props로 HTML 태그 속성을 확장하고 싶을 때는????

1. HTML button 태그를 대체하는 역할 

```ts
type NativeButtonProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>

const Button = (props: NativeButtonProps) => {
    return <button {...props}>button</button>
}
```

- ref를 전달한다면, 차이가 있음!

    - 클래스 컴포넌트와 함수 컴포넌트 간 차이가 존재 

    - 클래스 컴포넌트로 만들어진 버튼 = 컴포넌트 props로 전달된 ref가 Button 컴포넌트의 button 태그를 그대로 바라보게 됨 

    - 함수 컴포넌트로 만들어진 버튼 = 전달받은 ref가 Button 컴포넌트의 button 태그를 바라보지 않음 

- 클래스 컴포넌트에서 ref 객체 = 마운트된 컴포넌트의 인스턴스를 current 속성값으로 가지지만, 함수 컴포넌트에선 생성된 인스턴스가 없기 때문에 ref에 기대한 값이 할당되지 않는 것 

    - 함수 컴포넌트에서도 ref를 전달받을 수 있도록 도와주는 것 = React.forwardRef 

```ts
const Button = forwardRef((props, ref) => {
    return <button ref={ref} {...props}>버튼</button>
})

const WrappedButton = () => {
    const buttonRef = useRef();

    return (
        <div>
            <Button ref={buttonRef} />
        </div>
    )
}
```

- forwardRef = 2개의 제네릭 인자를 받을 수 있음 

    - 첫 번째 = ref에 대한 타입 정보, 두 번째 = props에 대한 타입 정보 

```ts
// button 태그에 대한 HTML 속성을 모두 포함하지만, ref는 제외됨 
// DetailedHTMLProps, HTMLProps, ComponentPropsWithref와 같이 ref를 포함하는 타입과는 다름 
const NativeButtonType = React.ComponentPropsWithoutRef<"button">


const Button = forwardRef<HTMLButtonElement, NativeButtonType>((props, ref) => {
    return <button ref={ref} {...props}>클릭</button>
})
```

- 함수 컴포넌트의 props로 DetailedHTMLProps와 같이 ref를 포함하는 타입을 사용하게 되면
    - 실제로는 동작하지 않는 ref를 받도록 타입이 지정됨, 예기치 않은 에러 발생 가능 

- HTML 속성을 확장하는 props를 설계할 때 = ComponentPropsWithoutRef 타입을 사용해 ref가 실제로 forwardRef와 함께 사용될 때만 props로 전달되도록 타입 정의하는 것이 안전

