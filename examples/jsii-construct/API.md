# API Reference

**Classes**

Name|Description
----|-----------
[Example](#test-jsii-construct-example)|*No description*


**Structs**

Name|Description
----|-----------
[ExampleProps](#test-jsii-construct-exampleprops)|*No description*



## class Example  <a id="test-jsii-construct-example"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new Example(scope: Construct, id: string, props?: ExampleProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[ExampleProps](#test-jsii-construct-exampleprops)</code>)  *No description*
  * **visibilityTimeout** (<code>[Duration](#aws-cdk-core-duration)</code>)  The visibility timeout to be configured on the SQS Queue, in seconds. __*Default*__: Duration.seconds(300)



### Properties


Name | Type | Description 
-----|------|-------------
**queueArn** | <code>string</code> | <span></span>



## struct ExampleProps  <a id="test-jsii-construct-exampleprops"></a>






Name | Type | Description 
-----|------|-------------
**visibilityTimeout**? | <code>[Duration](#aws-cdk-core-duration)</code> | The visibility timeout to be configured on the SQS Queue, in seconds.<br/>__*Default*__: Duration.seconds(300)



