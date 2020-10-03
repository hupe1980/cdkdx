# README

**[construct](#readme)**

> Globals

# construct

## Index

### Classes

* [Example](#example)

### Interfaces

* [ExampleProps](#exampleprops)

# Example

**[construct](#readme)**

> [Globals](#readme) / Example

# Class: Example

## Hierarchy

* Construct

  ↳ **Example**

## Implements

* IConstruct
* IConstruct

## Index

### Constructors

* [constructor](#constructor)

### Properties

* [node](#node)
* [queueArn](#queuearn)

### Methods

* [onPrepare](#onprepare)
* [onSynthesize](#onsynthesize)
* [onValidate](#onvalidate)
* [prepare](#prepare)
* [synthesize](#synthesize)
* [toString](#tostring)
* [validate](#validate)
* [isConstruct](#isconstruct)

## Constructors

### constructor

\+ **new Example**(`scope`: Construct, `id`: string, `props`: [ExampleProps](#exampleprops)): [Example](#example)

*Overrides void*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`scope` | Construct | - |
`id` | string | - |
`props` | [ExampleProps](#exampleprops) | {} |

**Returns:** [Example](#example)

## Properties

### node

• `Readonly` **node**: ConstructNode

*Inherited from [Example](#example).[node](#node)*

The construct tree node associated with this construct.

___

### queueArn

• `Readonly` **queueArn**: string

**`returns`** the ARN of the SQS queue

## Methods

### onPrepare

▸ `Protected`**onPrepare**(): void

*Inherited from [Example](#example).[onPrepare](#onprepare)*

*Overrides void*

Perform final modifications before synthesis.

This method can be implemented by derived constructs in order to perform
final changes before synthesis. prepare() will be called after child
constructs have been prepared.

This is an advanced framework feature. Only use this if you
understand the implications.

**Returns:** void

___

### onSynthesize

▸ `Protected`**onSynthesize**(`session`: ISynthesisSession): void

*Inherited from [Example](#example).[onSynthesize](#onsynthesize)*

*Overrides void*

Allows this construct to emit artifacts into the cloud assembly during synthesis.

This method is usually implemented by framework-level constructs such as `Stack` and `Asset`
as they participate in synthesizing the cloud assembly.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`session` | ISynthesisSession | The synthesis session.  |

**Returns:** void

___

### onValidate

▸ `Protected`**onValidate**(): string[]

*Inherited from [Example](#example).[onValidate](#onvalidate)*

*Overrides void*

Validate the current construct.

This method can be implemented by derived constructs in order to perform
validation logic. It is called on all constructs before synthesis.

**Returns:** string[]

An array of validation error messages, or an empty array if the construct is valid.

___

### prepare

▸ `Protected`**prepare**(): void

*Inherited from [Example](#example).[prepare](#prepare)*

Perform final modifications before synthesis.

This method can be implemented by derived constructs in order to perform
final changes before synthesis. prepare() will be called after child
constructs have been prepared.

This is an advanced framework feature. Only use this if you
understand the implications.

**Returns:** void

___

### synthesize

▸ `Protected`**synthesize**(`session`: ISynthesisSession): void

*Inherited from [Example](#example).[synthesize](#synthesize)*

Allows this construct to emit artifacts into the cloud assembly during synthesis.

This method is usually implemented by framework-level constructs such as `Stack` and `Asset`
as they participate in synthesizing the cloud assembly.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`session` | ISynthesisSession | The synthesis session.  |

**Returns:** void

___

### toString

▸ **toString**(): string

*Inherited from [Example](#example).[toString](#tostring)*

Returns a string representation of this construct.

**Returns:** string

___

### validate

▸ `Protected`**validate**(): string[]

*Inherited from [Example](#example).[validate](#validate)*

Validate the current construct.

This method can be implemented by derived constructs in order to perform
validation logic. It is called on all constructs before synthesis.

**Returns:** string[]

An array of validation error messages, or an empty array if the construct is valid.

___

### isConstruct

▸ `Static`**isConstruct**(`x`: any): x is Construct

*Inherited from [Example](#example).[isConstruct](#isconstruct)*

Return whether the given object is a Construct.

#### Parameters:

Name | Type |
------ | ------ |
`x` | any |

**Returns:** x is Construct

# Exampleprops

**[construct](#readme)**

> [Globals](#readme) / ExampleProps

# Interface: ExampleProps

## Hierarchy

* **ExampleProps**

## Index

### Properties

* [visibilityTimeout](#visibilitytimeout)

## Properties

### visibilityTimeout

• `Optional` **visibilityTimeout**: Duration

The visibility timeout to be configured on the SQS Queue, in seconds.

**`default`** Duration.seconds(300)
