# README

[construct](#readme)

# construct

## Index

### Classes

* [Example](#example)

### Interfaces

* [ExampleProps](#exampleprops)

# Example

[construct](#readme) › [Example](#example)

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

* [node](#readonly-node)
* [queueArn](#readonly-queuearn)

### Methods

* [onPrepare](#protected-onprepare)
* [onSynthesize](#protected-onsynthesize)
* [onValidate](#protected-onvalidate)
* [prepare](#protected-prepare)
* [synthesize](#protected-synthesize)
* [toString](#tostring)
* [validate](#protected-validate)
* [isConstruct](#static-isconstruct)

## Constructors

###  constructor

\+ **new Example**(`scope`: Construct, `id`: string, `props`: [ExampleProps](#exampleprops)): *[Example](#example)*

*Overrides void*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`scope` | Construct | - |
`id` | string | - |
`props` | [ExampleProps](#exampleprops) | {} |

**Returns:** *[Example](#example)*

## Properties

### `Readonly` node

• **node**: *ConstructNode*

*Inherited from [Example](#example).[node](#readonly-node)*

The construct tree node associated with this construct.

___

### `Readonly` queueArn

• **queueArn**: *string*

**`returns`** the ARN of the SQS queue

## Methods

### `Protected` onPrepare

▸ **onPrepare**(): *void*

*Inherited from [Example](#example).[onPrepare](#protected-onprepare)*

*Overrides void*

Perform final modifications before synthesis

This method can be implemented by derived constructs in order to perform
final changes before synthesis. prepare() will be called after child
constructs have been prepared.

This is an advanced framework feature. Only use this if you
understand the implications.

**Returns:** *void*

___

### `Protected` onSynthesize

▸ **onSynthesize**(`session`: ISynthesisSession): *void*

*Inherited from [Example](#example).[onSynthesize](#protected-onsynthesize)*

*Overrides void*

Allows this construct to emit artifacts into the cloud assembly during synthesis.

This method is usually implemented by framework-level constructs such as `Stack` and `Asset`
as they participate in synthesizing the cloud assembly.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`session` | ISynthesisSession | The synthesis session.  |

**Returns:** *void*

___

### `Protected` onValidate

▸ **onValidate**(): *string[]*

*Inherited from [Example](#example).[onValidate](#protected-onvalidate)*

*Overrides void*

Validate the current construct.

This method can be implemented by derived constructs in order to perform
validation logic. It is called on all constructs before synthesis.

**Returns:** *string[]*

An array of validation error messages, or an empty array if the construct is valid.

___

### `Protected` prepare

▸ **prepare**(): *void*

*Inherited from [Example](#example).[prepare](#protected-prepare)*

Perform final modifications before synthesis

This method can be implemented by derived constructs in order to perform
final changes before synthesis. prepare() will be called after child
constructs have been prepared.

This is an advanced framework feature. Only use this if you
understand the implications.

**Returns:** *void*

___

### `Protected` synthesize

▸ **synthesize**(`session`: ISynthesisSession): *void*

*Inherited from [Example](#example).[synthesize](#protected-synthesize)*

Allows this construct to emit artifacts into the cloud assembly during synthesis.

This method is usually implemented by framework-level constructs such as `Stack` and `Asset`
as they participate in synthesizing the cloud assembly.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`session` | ISynthesisSession | The synthesis session.  |

**Returns:** *void*

___

###  toString

▸ **toString**(): *string*

*Inherited from [Example](#example).[toString](#tostring)*

Returns a string representation of this construct.

**Returns:** *string*

___

### `Protected` validate

▸ **validate**(): *string[]*

*Inherited from [Example](#example).[validate](#protected-validate)*

Validate the current construct.

This method can be implemented by derived constructs in order to perform
validation logic. It is called on all constructs before synthesis.

**Returns:** *string[]*

An array of validation error messages, or an empty array if the construct is valid.

___

### `Static` isConstruct

▸ **isConstruct**(`x`: any): *x is Construct*

*Inherited from [Example](#example).[isConstruct](#static-isconstruct)*

Return whether the given object is a Construct

**Parameters:**

Name | Type |
------ | ------ |
`x` | any |

**Returns:** *x is Construct*

# Exampleprops

[construct](#readme) › [ExampleProps](#exampleprops)

# Interface: ExampleProps

## Hierarchy

* **ExampleProps**

## Index

### Properties

* [visibilityTimeout](#optional-visibilitytimeout)

## Properties

### `Optional` visibilityTimeout

• **visibilityTimeout**? : *Duration*

The visibility timeout to be configured on the SQS Queue, in seconds.

**`default`** Duration.seconds(300)
