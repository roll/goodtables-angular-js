describe('main', function () {

  beforeEach(function () {
    browser.get('/');
  });

  it('should have a main title', function () {
    expect(element(by.css('h1')).getText()).toEqual('Report');
  });

});
