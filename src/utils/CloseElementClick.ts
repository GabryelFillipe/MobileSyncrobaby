function CloseElement(elementChild: any, functionClose: any, target: any) {
    const child = elementChild.current

    if(!child.contains(target.target)){
        functionClose(false)
    }

}

export default { CloseElement }