TESTS=test/spec/*.js
NPM_BIN=node_modules/.bin
export NPM_BIN

MAKEFLAGS+=-j 4

STYL = $(shell find src -type f -regex '^[^_]*\.styl')
CSS = $(patsubst %.styl, %.css, $(STYL))
YATE = $(shell find src/blocks -type f -regex '^[^_]*\.yate')
YATE_JS = $(patsubst %.yate, %.yate.js, $(YATE))
JS = $(shell find src -type f -regex '^[^_]*\.js')

all: npm src/xblocks.yate.js lib/xblocks.yate.js lib/xblocks.css lib/xblocks.js lib/freeze.json $(YATE_JS) $(CSS)

clean:
	rm -f lib/xblocks.js
	rm -f lib/_xblocks.js
	rm -f lib/xblocks.yate.js
	rm -f lib/_xblocks.yate.js
	rm -f lib/xblocks.css
	rm -f lib/_xblocks.css
	rm -f lib/freeze.json
	rm -rf lib/_
	find src -type f -regex '.*\.\(css\|yate\.js\|yate\.obj\)' -delete


### CSS ############################################

$(CSS): %.css: %.styl npm
	node bin/styl.js -input=$< -output=$@
	$(NPM_BIN)/borschik --input=$@ --output=$(dir $@)_$(notdir $@)


lib/xblocks.css: $(CSS) npm
	find src -type f -regex '^[^_]*\.css' | sort -r | xargs cat > $@
	$(NPM_BIN)/borschik --input=$@ --output=$(dir $@)_$(notdir $@)




### YATE ###########################################

src/xblocks.yate.js: src/xblocks.yate npm
	$(NPM_BIN)/yate --output=src/xblocks.yate.js src/xblocks.yate


$(YATE_JS): %.yate.js: %.yate npm src/xblocks.yate.js
	$(NPM_BIN)/yate --import=src/xblocks.yate.obj --output=$@ $<


lib/xblocks.yate.js: src/xblocks.yate.js $(YATE_JS) npm
	find src -type f -name '*.yate.js' | sort -r | xargs cat > $@
	$(NPM_BIN)/borschik --input=$@ --output=$(dir $@)_$(notdir $@)



### FREEZE #########################################

lib/freeze.json: $(CSS) npm
	$(NPM_BIN)/borschik --tech=json --input=freeze.json --output=$@



### JS #############################################

lib/xblocks.js: src/index.js lib/freeze.json $(JS) npm
	$(NPM_BIN)/borschik --input=src/index.js --minimize=no --output=$@
	$(NPM_BIN)/borschik --input=$@ --output=$(dir $@)_$(notdir $@)


npm:
	npm install



#build:
#	./node_modules/.bin/requirer index.js strftime.js

#prod: build
#	./node_modules/.bin/uglifyjs -o strftime.min.js strftime.js

test:
	./node_modules/.bin/jshint .
	./node_modules/.bin/jscs .
#	./node_modules/.bin/mocha --reporter dot $(TESTS)

.PHONY: all clean test

