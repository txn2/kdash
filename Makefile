IMAGE    ?= txn2/kdash
VERSION  ?= $(shell git describe --abbrev=0 --tags)
.PHONY: all

all: build

build: build-amd64 build-armhf

build-amd64:
	docker build -t $(IMAGE):$(VERSION) -f ./dockerfiles/amd64/Dockerfile .
	docker tag $(IMAGE):$(VERSION) $(IMAGE):latest
	docker push $(IMAGE):$(VERSION)
	docker push $(IMAGE):latest

build-armhf:
	docker build -t $(IMAGE):armhf-$(VERSION) -f ./dockerfiles/arm/Dockerfile .
	docker tag $(IMAGE):armhf-$(VERSION) $(IMAGE):armhf-latest
	docker push $(IMAGE):armhf-$(VERSION)
	docker push $(IMAGE):armhf-latest