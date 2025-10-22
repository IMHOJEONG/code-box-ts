### 제네릭 컴포넌트??

```ts
const FruitSelect = () => {
    const [fruit, changeFruit] = useState<Fruit | undefined>();

    return (
        // selectedOption은 options에 존재하지 않는 값을 받아도 아무런 오류가 발생하지 않음 
        // Option의 타입에서 key -> string이기만 하면 prop으로 넘겨줄 수 있기 때문 
        <Select onChange={changeFruit} options={fruits} selectedOption="orange" />
    )
}
```

- changeFruit의 매개변수 Fruit는 prop으로 전달되야 하는 onChange의 매개변수 타입은 string보다 좁기 때문에, 타입 에러가 발생 

- Select를 사용하는 입장에서 제한된 key, value만을 가지도록 하려면??

    - 함수 컴포넌트 역시 함수이므로 제네릭을 사용한 컴포넌트를 만들어낼 수 있음 

### HTMLAttributes, ReactProps 적용하기 

- 리액트에서 제공하는 타입을 사용하면 더 정확한 타입 설정 가능 

```ts
type ReactSelectProps = React.ComponentPropsWithoutRef<"select">;

interface SelectProps<OptionType extends Record<string, string>> {
    id?: ReactSelectProps["id"];
    className?: ReactSelectProps["className"];
}
```

- ComponentPropsWithoutRef = 리액트 컴포넌트의 prop 타입을 반환해주는 타입 

- Type['key']를 활용하면, 객체 형식의 타입 내부 속성값 획득 가능 

- Pick 키워드를 사용해 ReactProps에서 여러 개의 타입을 가져와야 함 

    - `Pick<Type, 'key1' | 'key2' ...>`는 객체 형식의 타입에서 key1, key2...의 속성만 추출하여 새로운 객체 형식의 타입을 반환 

```ts
interface SelectProps<OptionType extends Record<string, string>> extends Pick<ReactSelectProps, "id" | "key" | /*...*/> {
    // 
}
```

### 공변성과 반공변성 

- 객체의 메서드 타입을 정의하는 상황을 가정 & 2가지 방법이 존재 

```ts
interface Props<T extends string> {
    onChangeA?: (selected: T) => void;
    onChangeB?(selected: T): void;
}

const Component = () => {
    const changeToPineApple = (selectedApple: "apple") => {
        console.log("this is pine" + selectedApple);
    }

    return (
        <Select

            // Error
            // onChangeA={changToPineApple}
            
            // OK
            onChangeB={changeToPineApple}
        
        />
    )
}
```

`타입 A가 B의 서브타입일 때, T<A>가 T<B>의 서브타입이 된다면, 공변성을 띠고 있다`

```ts
interface User {
    id: string;
}

interface Member extends User {
    nickName: string;
}

let users: Array<User> = [];
let members: Array<Member> = [];

users = members; // OK
members = users; // Error 
```

- 일반적인 타입들은 공변성을 가지고 있어, 좁은 타입에서 넓은 타입으로 할당이 가능 

- 제네릭 타입을 지닌 함수는 반공변성을 가짐 

    - `T<B>가 T<A>의 서브타입이 되어, 좁은 타입 T<A>의 함수를 넓은 타입 T<B>의 함수에 적용할 수 없다는 것 의미`

```ts 
type PrintUserInfo<U extends User> = (user: U) => void;

let printUser: PrintUserInfo<User> = (user) => console.log(user.id)

let printMember: PrintUserInfo<Member> = (user) => console.log(user.id, user.nickName);

printMember = printUser; // OK

// printUser는 PrintUserInfo<User> 타입으로 정의되어 있어, Member 타입을 매개변수로 받을 수 없음 
// 할당 불가 
printUser = printMember; 
``` 

- 안전한 타입 가드를 위해선 특수한 경우를 제외하고, 일반적으로 반공변적인 함수 타입을 설정하는 것이 권장됨 

```ts
interface Props<T extends string> {
    // 반공변성을 띰
    onChangeA?: (selected: T) => void;

    // 공변성과 반공변성을 모두 가지는 이변성을 띰 
    onChangeB?(selected: T): void;
}
```