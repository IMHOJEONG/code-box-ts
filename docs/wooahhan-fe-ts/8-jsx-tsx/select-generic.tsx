interface SelectProps<OptionType extends Record<string, string>> {
      options: OptionType;
      selectedOption?: keyof OptionType;
      onChange?: (selected?: keyof OptionType) => void;
}

const Select = <OptionType extends Record<string, string>>({
    options,
    selectedOption,
    onChange
}: SelectProps<OptionType>) => {

}

// Select 컴포넌트에 전달되는 props의 타입 기반으로 타입이 추론되어, <Select<추론된_타입>> 형태의 컴포넌트가 생성됨 