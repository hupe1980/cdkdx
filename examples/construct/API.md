# README

construct

# construct

## Table of contents

### Classes

- [Example](#example)

### Interfaces

- [ExampleProps](#exampleprops)

# Example

[construct](#readme) / Example

# Class: Example

## Hierarchy

* *Construct*

  ↳ **Example**

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

\+ **new Example**(`scope`: *Construct*, `id`: *string*, `props?`: [*ExampleProps*](#exampleprops)): [*Example*](#example)

#### Parameters:

Name | Type |
:------ | :------ |
`scope` | *Construct* |
`id` | *string* |
`props` | [*ExampleProps*](#exampleprops) |

**Returns:** [*Example*](#example)

Overrides: void

## Properties

### node

• `Readonly` **node**: *ConstructNode*

The construct tree node associated with this construct.

**`stability`** stable

Inherited from: void

___

### queueArn

• `Readonly` **queueArn**: *string*

**`returns`** the ARN of the SQS queue

## Methods

### onPrepare

▸ `Protected`**onPrepare**(): *void*

Perform final modifications before synthesis.

This method can be implemented by derived constructs in order to perform
final changes before synthesis. prepare() will be called after child
constructs have been prepared.

This is an advanced framework feature. Only use this if you
understand the implications.

**`stability`** stable

**Returns:** *void*

Inherited from: void

___

### onSynthesize

▸ `Protected`**onSynthesize**(`session`: ISynthesisSession): *void*

Allows this construct to emit artifacts into the cloud assembly during synthesis.

This method is usually implemented by framework-level constructs such as `Stack` and `Asset`
as they participate in synthesizing the cloud assembly.

**`stability`** stable

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`session` | ISynthesisSession | The synthesis session.   |

**Returns:** *void*

Inherited from: void

___

### onValidate

▸ `Protected`**onValidate**(): *string*[]

Validate the current construct.

This method can be implemented by derived constructs in order to perform
validation logic. It is called on all constructs before synthesis.

**`stability`** stable

**Returns:** *string*[]

An array of validation error messages, or an empty array if the construct is valid.

Inherited from: void

___

### prepare

▸ `Protected`**prepare**(): *void*

Perform final modifications before synthesis.

This method can be implemented by derived constructs in order to perform
final changes before synthesis. prepare() will be called after child
constructs have been prepared.

This is an advanced framework feature. Only use this if you
understand the implications.

**`stability`** stable

**Returns:** *void*

Inherited from: void

___

### synthesize

▸ `Protected`**synthesize**(`session`: ISynthesisSession): *void*

Allows this construct to emit artifacts into the cloud assembly during synthesis.

This method is usually implemented by framework-level constructs such as `Stack` and `Asset`
as they participate in synthesizing the cloud assembly.

**`stability`** stable

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`session` | ISynthesisSession | The synthesis session.   |

**Returns:** *void*

Inherited from: void

___

### toString

▸ **toString**(): *string*

Returns a string representation of this construct.

**Returns:** *string*

Inherited from: void

___

### validate

▸ `Protected`**validate**(): *string*[]

Validate the current construct.

This method can be implemented by derived constructs in order to perform
validation logic. It is called on all constructs before synthesis.

**`stability`** stable

**Returns:** *string*[]

An array of validation error messages, or an empty array if the construct is valid.

Inherited from: void

___

### isConstruct

▸ `Static`**isConstruct**(`x`: *any*): x is Construct

Return whether the given object is a Construct.

**`stability`** stable

#### Parameters:

Name | Type |
:------ | :------ |
`x` | *any* |

**Returns:** x is Construct

Inherited from: void

# Exampleprops

[construct](#readme) / ExampleProps

# Interface: ExampleProps

## Table of contents

### Properties

- [visibilityTimeout](#visibilitytimeout)

## Properties

### visibilityTimeout

• `Optional` **visibilityTimeout**: *Duration*

The visibility timeout to be configured on the SQS Queue, in seconds.

**`default`** Duration.seconds(300)
