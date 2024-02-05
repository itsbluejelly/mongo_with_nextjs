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

// A GENERIC TO CREATE THE ACTION TYPE OF A CONTEXT
export type ActionTypeGenerator<Type extends object> = {
    [key in keyof Type]: Type[key] extends never ? { type: key } : { type: key, payload: Type[key] }
}[keyof Type]