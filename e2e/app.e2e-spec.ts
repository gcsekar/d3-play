import { D3PlayPage } from './app.po';

describe('d3-play App', () => {
  let page: D3PlayPage;

  beforeEach(() => {
    page = new D3PlayPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
