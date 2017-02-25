import { FantasyBaseballPage } from './app.po';

describe('fantasy-baseball App', () => {
  let page: FantasyBaseballPage;

  beforeEach(() => {
    page = new FantasyBaseballPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
