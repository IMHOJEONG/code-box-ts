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

