# WebScrapping
### Download the latest version of "Padrão TISS" pdf from [this website](https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss).

#### Installing the dependencies:
```bash
yarn
```

#### Running:
```bash
yarn start
```
- NOTE: the .pdf file will be dowloaded in root folder.
#### Building:
```bash
yarn tsc
```
- ***The building process will create a folder called dist/ in root folder.***
#### Running build version:
```bash
cd dist/
node index.js
```
- NOTE: the .pdf file will be dowloaded in dist/ folder.
