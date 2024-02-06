// DEFINING A GENERIC FOR FORMATTING INTERSECTION TYPES
export type Prettier<Type extends object> = {
    [name in keyof Type] : Type[name]
}

// A GENERIC TYPE TO MAKE ALL PROPERTIES OPTIONAL IN AN OBJECT
export type OptionalGenerator<Type extends Object> = {
    [key in keyof Type]?: Type[key]
}

// A GENERIC TYPE TO OMIT CERTAIN PROPERTIES IN AN OBJECT
export type Omitter<ObjectType extends object, KeyType extends keyof ObjectType> = {
    [key in keyof ObjectType as key extends KeyType ? never : key]: ObjectType[key]
}

// A GENERIC TO CREATE AN OBJECT
export type ObjectTypeGenerator<Type extends object> = {
    [key in keyof Type]: Type[key] extends never ? never : Type[key]
}

// A GENERIC TO MAP AN OBJECT'S KEYS TO A SPECIFIC TYPE
export type Commonify<Type extends object, CommonType> = {
    [key in keyof Type]: CommonType
}

// A GENERIC THAT FINDS THE TYPE OF THE RETURNED VALUE
export type FindReturn<Type extends (...args: any) => any> = Type extends (...args: any) => infer P ? P : unknown