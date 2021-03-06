describe('pageflow.AdjacentPreparer', function() {
  var p = pageflow;

  describe('#prepareAdjacent', function() {
    it('calls prepare for adjacent pages', function() {
      var page = fakePage({id: 'current'});
      var adjacentPage = fakePage();
      var adjacentPages = fakeAdjacentPages([page, [adjacentPage]]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(page);

      expect(adjacentPage.prepare).to.have.been.called;
    });

    it('limits maximal number of prepared pages', function() {
      var page = fakePage({id: 'current'});
      var pages = _.times(10, function() { return fakePage() });
      var adjacentPages = fakeAdjacentPages([page, pages]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(page);

      expect(pages[0].prepare).to.have.been.called;
      expect(pages[1].prepare).to.have.been.called;
      expect(pages[9].prepare).not.to.have.been.called;
    });

    it('supports configuring limit via setting in debugMode', function() {
      var page = fakePage({id: 'current'});
      var pages = _.times(2, function() { return fakePage() });
      var adjacentPages = fakeAdjacentPages([page, pages]);
      var settings = new Backbone.Model();
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages, settings, true);

      settings.set('max_prepared_adjacent_pages', 1);
      adjacentPreparer.prepareAdjacent(page);

      expect(pages[0].prepare).to.have.been.called;
      expect(pages[1].prepare).not.to.have.been.called;
    });

    it('ignores setting when not in debugMode', function() {
      var page = fakePage({id: 'current'});
      var pages = _.times(2, function() { return fakePage() });
      var adjacentPages = fakeAdjacentPages([page, pages]);
      var settings = new Backbone.Model();
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages, settings);

      settings.set('max_prepared_adjacent_pages', 1);
      adjacentPreparer.prepareAdjacent(page);

      expect(pages[0].prepare).to.have.been.called;
      expect(pages[1].prepare).to.have.been.called;
    });

    it('does not call prepare for previously prepared pages which are also adjacent of current page', function() {
      var lastPage = fakePage();
      var page = fakePage();
      var commonAdjacentPage = fakePage();;
      var adjacentPages = fakeAdjacentPages([lastPage, [commonAdjacentPage]],
                                            [page, [commonAdjacentPage]]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(lastPage);
      adjacentPreparer.prepareAdjacent(page);

      expect(commonAdjacentPage.prepare).to.have.been.calledOnce;
    });

    it('calls unprepare for previously prepared pages which are not adjacent of current page', function() {
      var lastPage = fakePage();
      var page = fakePage();
      var adjacentPageOfLastPage = fakePage();
      var adjacentPages = fakeAdjacentPages([lastPage, [adjacentPageOfLastPage]],
                                            [page, []]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(lastPage);
      adjacentPreparer.prepareAdjacent(page);

      expect(adjacentPageOfLastPage.unprepare).to.have.been.called;
    });

    it('does not call unprepare for previously prepared pages which are also adjacent of current page', function() {
      var lastPage = fakePage();
      var page = fakePage();
      var commonAdjacentPage = fakePage();
      var adjacentPages = fakeAdjacentPages([lastPage, [commonAdjacentPage]],
                                            [page, [commonAdjacentPage]]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(lastPage);
      adjacentPreparer.prepareAdjacent(page);

      expect(commonAdjacentPage.unprepare).not.to.have.been.called;
    });

    it('does not call unprepare for previously prepared pages has become current page', function() {
      var lastPage = fakePage();
      var page = fakePage();
      var adjacentPages = fakeAdjacentPages([lastPage, [page]],
                                            [page, []]);
      var adjacentPreparer = new p.AdjacentPreparer(adjacentPages);

      adjacentPreparer.prepareAdjacent(lastPage);
      adjacentPreparer.prepareAdjacent(page);

      expect(page.unprepare).not.to.have.been.called;
    });
  });

  function fakeAdjacentPages(/* pairs */) {
    var pairs = arguments;
    var stub = sinon.stub();

    _(pairs).each(function(pair) {
      var page = pair[0];
      var adjacentPages = pair[1];

      stub.withArgs(page).returns(adjacentPages);
    });

    return {of: stub};
  }

  function fakePage() {
    return {prepare: sinon.spy(), unprepare: sinon.spy(), preload: sinon.spy()};
  }
});
