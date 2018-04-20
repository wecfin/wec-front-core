## Usage

```javascript
import {CompanyLayout} from 'wec-front-core';

const layout = new CompanyLayout();
```

### breadcrumb

```javascript
layout.setBreadcrumb([
  {
    title: 'HOME', href: '/c/wec'
  },{
    title: 'csOrder', href: '/c/wec/list-cs-order'
  },{
    title: [ordercode], href: ''
  }
])
```

### select menu

```javascript
layout.selectMenu({
  app: 'order',
  product: 'spu'
})
```

### fill main area

```javascript
layout.mainHtml`
  <div>your content here<div>
`;
```
