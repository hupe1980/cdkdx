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

| Name | Type | Default value |
| :------ | :------ | :------ |
| `scope` | *Construct* | - |
| `id` | *string* | - |
| `props` | [*ExampleProps*](#exampleprops) | {} |

**Returns:** [*Example*](#example)

Overrides: Construct.constructor

## Properties

### node

• `Readonly` **node**: *ConstructNode*

The construct tree node associated with this construct.

**`stability`** stable

Inherited from: Construct.node

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

Inherited from: Construct.onPrepare

___

### onSynthesize

▸ `Protected`**onSynthesize**(`session`: ISynthesisSession): *void*

Allows this construct to emit artifacts into the cloud assembly during synthesis.

This method is usually implemented by framework-level constructs such as `Stack` and `Asset`
as they participate in synthesizing the cloud assembly.

**`stability`** stable

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `session` | ISynthesisSession | The synthesis session. |

**Returns:** *void*

Inherited from: Construct.onSynthesize

___

### onValidate

▸ `Protected`**onValidate**(): *string*[]

Validate the current construct.

This method can be implemented by derived constructs in order to perform
validation logic. It is called on all constructs before synthesis.

**`stability`** stable

**Returns:** *string*[]

An array of validation error messages, or an empty array if the construct is valid.

Inherited from: Construct.onValidate

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

Inherited from: Construct.prepare

___

### synthesize

▸ `Protected`**synthesize**(`session`: ISynthesisSession): *void*

Allows this construct to emit artifacts into the cloud assembly during synthesis.

This method is usually implemented by framework-level constructs such as `Stack` and `Asset`
as they participate in synthesizing the cloud assembly.

**`stability`** stable

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `session` | ISynthesisSession | The synthesis session. |

**Returns:** *void*

Inherited from: Construct.synthesize

___

### toString

▸ **toString**(): *string*

Returns a string representation of this construct.

**`stability`** stable

**Returns:** *string*

Inherited from: Construct.toString

___

### validate

▸ `Protected`**validate**(): *string*[]

Validate the current construct.

This method can be implemented by derived constructs in order to perform
validation logic. It is called on all constructs before synthesis.

**`stability`** stable

**Returns:** *string*[]

An array of validation error messages, or an empty array if the construct is valid.

Inherited from: Construct.validate

___

### isConstruct

▸ `Static`**isConstruct**(`x`: *any*): x is Construct

Return whether the given object is a Construct.

**`stability`** stable

#### Parameters:

| Name | Type |
| :------ | :------ |
| `x` | *any* |

**Returns:** x is Construct

Inherited from: Construct.isConstruct

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
