FROM public.ecr.aws/lambda/provided:latest

ARG asset_name
ARG KUBECTL_VERSION=1.20.0

USER root
RUN mkdir -p /opt
WORKDIR /opt

#
# tools
#

RUN yum update -y && yum install -y zip

#
# layer
# 

RUN mkdir -p /opt/kubectl
RUN cd /opt/kubectl && curl -LO "https://storage.googleapis.com/kubernetes-release/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl"
RUN chmod +x /opt/kubectl/kubectl

#
# create the bundle
#

RUN zip --symlinks -r ../$asset_name *

WORKDIR /
ENTRYPOINT [ "/bin/bash" ]