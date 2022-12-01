# README

construct

# construct

## Table of contents

### Classes

- [DemoLayer](#demo-layer)
- [Example](#example)

### Interfaces

- [ExampleProps](#example-props)

# Demo Layer

[construct](#readme) / DemoLayer

# Class: DemoLayer

## Hierarchy

- `LayerVersion`

  ↳ **`DemoLayer`**

## Table of contents

### Constructors

- [constructor](#constructor)

### Properties

- [compatibleRuntimes](#compatibleruntimes)
- [env](#env)
- [layerVersionArn](#layerversionarn)
- [node](#node)
- [physicalName](#physicalname)
- [stack](#stack)

### Methods

- [addPermission](#addpermission)
- [applyRemovalPolicy](#applyremovalpolicy)
- [generatePhysicalName](#generatephysicalname)
- [getResourceArnAttribute](#getresourcearnattribute)
- [getResourceNameAttribute](#getresourcenameattribute)
- [onPrepare](#onprepare)
- [onSynthesize](#onsynthesize)
- [onValidate](#onvalidate)
- [prepare](#prepare)
- [synthesize](#synthesize)
- [toString](#tostring)
- [validate](#validate)
- [fromLayerVersionArn](#fromlayerversionarn)
- [fromLayerVersionAttributes](#fromlayerversionattributes)
- [isConstruct](#isconstruct)
- [isResource](#isresource)

## Constructors

### constructor

• **new DemoLayer**(`scope`, `id`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `Construct` |
| `id` | `string` |

#### Overrides

lambda.LayerVersion.constructor

## Properties

### compatibleRuntimes

• `Optional` `Readonly` **compatibleRuntimes**: `Runtime`[]

#### Inherited from

lambda.LayerVersion.compatibleRuntimes

___

### env

• `Readonly` **env**: `ResourceEnvironment`

#### Inherited from

lambda.LayerVersion.env

___

### layerVersionArn

• `Readonly` **layerVersionArn**: `string`

#### Inherited from

lambda.LayerVersion.layerVersionArn

___

### node

• `Readonly` **node**: `ConstructNode`

#### Inherited from

lambda.LayerVersion.node

___

### physicalName

• `Protected` `Readonly` **physicalName**: `string`

#### Inherited from

lambda.LayerVersion.physicalName

___

### stack

• `Readonly` **stack**: `Stack`

#### Inherited from

lambda.LayerVersion.stack

## Methods

### addPermission

▸ **addPermission**(`id`, `permission`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `permission` | `LayerVersionPermission` |

#### Returns

`void`

#### Inherited from

lambda.LayerVersion.addPermission

___

### applyRemovalPolicy

▸ **applyRemovalPolicy**(`policy`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `policy` | `RemovalPolicy` |

#### Returns

`void`

#### Inherited from

lambda.LayerVersion.applyRemovalPolicy

___

### generatePhysicalName

▸ `Protected` **generatePhysicalName**(): `string`

#### Returns

`string`

#### Inherited from

lambda.LayerVersion.generatePhysicalName

___

### getResourceArnAttribute

▸ `Protected` **getResourceArnAttribute**(`arnAttr`, `arnComponents`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arnAttr` | `string` |  |
| `arnComponents` | `ArnComponents` |  |

#### Returns

`string`

#### Inherited from

lambda.LayerVersion.getResourceArnAttribute

___

### getResourceNameAttribute

▸ `Protected` **getResourceNameAttribute**(`nameAttr`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nameAttr` | `string` |  |

#### Returns

`string`

#### Inherited from

lambda.LayerVersion.getResourceNameAttribute

___

### onPrepare

▸ `Protected` **onPrepare**(): `void`

#### Returns

`void`

#### Inherited from

lambda.LayerVersion.onPrepare

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

lambda.LayerVersion.onSynthesize

___

### onValidate

▸ `Protected` **onValidate**(): `string`[]

#### Returns

`string`[]

#### Inherited from

lambda.LayerVersion.onValidate

___

### prepare

▸ `Protected` **prepare**(): `void`

#### Returns

`void`

#### Inherited from

lambda.LayerVersion.prepare

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

lambda.LayerVersion.synthesize

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Inherited from

lambda.LayerVersion.toString

___

### validate

▸ `Protected` **validate**(): `string`[]

#### Returns

`string`[]

#### Inherited from

lambda.LayerVersion.validate

___

### fromLayerVersionArn

▸ `Static` **fromLayerVersionArn**(`scope`, `id`, `layerVersionArn`): `ILayerVersion`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `Construct` |
| `id` | `string` |
| `layerVersionArn` | `string` |

#### Returns

`ILayerVersion`

#### Inherited from

lambda.LayerVersion.fromLayerVersionArn

___

### fromLayerVersionAttributes

▸ `Static` **fromLayerVersionAttributes**(`scope`, `id`, `attrs`): `ILayerVersion`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scope` | `Construct` |  |
| `id` | `string` |  |
| `attrs` | `LayerVersionAttributes` |  |

#### Returns

`ILayerVersion`

#### Inherited from

lambda.LayerVersion.fromLayerVersionAttributes

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

lambda.LayerVersion.isConstruct

___

### isResource

▸ `Static` **isResource**(`construct`): construct is CfnResource

#### Parameters

| Name | Type |
| :------ | :------ |
| `construct` | `IConstruct` |

#### Returns

construct is CfnResource

#### Inherited from

lambda.LayerVersion.isResource

# Example

[construct](#readme) / Example

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

Construct.constructor

## Properties

### node

• `Readonly` **node**: `ConstructNode`

#### Inherited from

Construct.node

___

### queueArn

• `Readonly` **queueArn**: `string`

## Methods

### onPrepare

▸ `Protected` **onPrepare**(): `void`

#### Returns

`void`

#### Inherited from

Construct.onPrepare

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

Construct.onSynthesize

___

### onValidate

▸ `Protected` **onValidate**(): `string`[]

#### Returns

`string`[]

#### Inherited from

Construct.onValidate

___

### prepare

▸ `Protected` **prepare**(): `void`

#### Returns

`void`

#### Inherited from

Construct.prepare

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

Construct.synthesize

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Inherited from

Construct.toString

___

### validate

▸ `Protected` **validate**(): `string`[]

#### Returns

`string`[]

#### Inherited from

Construct.validate

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

Construct.isConstruct

# Example Props

[construct](#readme) / ExampleProps

# Interface: ExampleProps

## Table of contents

### Properties

- [visibilityTimeout](#visibilitytimeout)

## Properties

### visibilityTimeout

• `Optional` **visibilityTimeout**: `Duration`
