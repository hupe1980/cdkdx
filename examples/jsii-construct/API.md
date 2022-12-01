# README

@test/jsii-construct

# @test/jsii-construct

## Table of contents

### Classes

- [Example](#example)

### Interfaces

- [ExampleProps](#example-props)

# Example

[@test/jsii-construct](#readme) / Example

# Class: Example

## Hierarchy

- `Construct`

  ↳ **`Example`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [node](#node)
- [queueArn](#queuearn)

### Methods

- [onPrepare](#onprepare)
- [onSynthesize](#onsynthesize)
- [onValidate](#onvalidate)
- [prepare](#prepare)
- [synthesize](#synthesize)
- [toString](#tostring)
- [validate](#validate)
- [isConstruct](#isconstruct)

## Constructors

### constructor

• **new Example**(`scope`, `id`, `props?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `Construct` |
| `id` | `string` |
| `props` | [`ExampleProps`](#example-props) |

#### Overrides

cdk.Construct.constructor

## Properties

### node

• `Readonly` **node**: `ConstructNode`

#### Inherited from

cdk.Construct.node

___

### queueArn

• `Readonly` **queueArn**: `string`

## Methods

### onPrepare

▸ `Protected` **onPrepare**(): `void`

#### Returns

`void`

#### Inherited from

cdk.Construct.onPrepare

___

### onSynthesize

▸ `Protected` **onSynthesize**(`session`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `session` | `ISynthesisSession` |  |

#### Returns

`void`

#### Inherited from

cdk.Construct.onSynthesize

___

### onValidate

▸ `Protected` **onValidate**(): `string`[]

#### Returns

`string`[]

#### Inherited from

cdk.Construct.onValidate

___

### prepare

▸ `Protected` **prepare**(): `void`

#### Returns

`void`

#### Inherited from

cdk.Construct.prepare

___

### synthesize

▸ `Protected` **synthesize**(`session`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `session` | `ISynthesisSession` |  |

#### Returns

`void`

#### Inherited from

cdk.Construct.synthesize

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Inherited from

cdk.Construct.toString

___

### validate

▸ `Protected` **validate**(): `string`[]

#### Returns

`string`[]

#### Inherited from

cdk.Construct.validate

___

### isConstruct

▸ `Static` **isConstruct**(`x`): x is Construct

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `any` |

#### Returns

x is Construct

#### Inherited from

cdk.Construct.isConstruct

# Example Props

[@test/jsii-construct](#readme) / ExampleProps

# Interface: ExampleProps

## Table of contents

### Properties

- [visibilityTimeout](#visibilitytimeout)

## Properties

### visibilityTimeout

• `Optional` `Readonly` **visibilityTimeout**: `Duration`
