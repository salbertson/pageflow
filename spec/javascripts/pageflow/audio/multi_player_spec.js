describe('pageflow.Audio.MultiPlayer', function() {
  describe('#fadeTo', function() {
    it('plays and fades in new player', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});

      sinon.spy(player, 'playAndFadeIn');

      multiPlayer.fadeTo(5);

      expect(player.playAndFadeIn).to.have.been.calledWith(1000);
    });

    it('fades and pauses previous player', function() {
      var previousPlayer = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({
        5: previousPlayer,
        6: new pageflow.AudioPlayer.Null()
      });
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});

      sinon.spy(previousPlayer, 'fadeOutAndPause');

      multiPlayer.fadeTo(5);
      multiPlayer.fadeTo(6);

      expect(previousPlayer.fadeOutAndPause).to.have.been.calledWith(1000);
    });

    it('does not interrupt playback when fading to same audio file', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000
      });

      sinon.spy(player, 'playAndFadeIn');
      sinon.stub(player, 'paused').returns(false);

      multiPlayer.fadeTo(5);
      multiPlayer.fadeTo(5);

      expect(player.playAndFadeIn).to.have.been.calledOnce;
    });

    it('rewinds if playFromBeginning option is true', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000,
        playFromBeginning: true
      });

      sinon.spy(player, 'rewind');

      multiPlayer.fadeTo(5);

      expect(player.rewind).to.have.been.called;
    });

    it('restarts same audio file if playFromBeginning option is true', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000,
        playFromBeginning: true
      });

      sinon.spy(player, 'playAndFadeIn');

      multiPlayer.fadeTo(5);
      multiPlayer.fadeTo(5);

      expect(player.playAndFadeIn).to.have.been.calledTwice;
    });

    it('rewinds if rewindOnChange option is true', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000,
        rewindOnChange: true
      });

      sinon.spy(player, 'rewind');

      multiPlayer.fadeTo(5);

      expect(player.rewind).to.have.been.called;
    });

    it('does not interrupt when fading to same audio file when rewindOnChange option is true', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000,
        rewindOnChange: true
      });

      sinon.spy(player, 'playAndFadeIn');
      sinon.stub(player, 'paused').returns(false);

      multiPlayer.fadeTo(5);
      multiPlayer.fadeTo(5);

      expect(player.playAndFadeIn).to.have.been.calledOnce;
    });

    it('plays and fades in same audio file if paused', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000
      });

      sinon.spy(player, 'playAndFadeIn');

      multiPlayer.fadeTo(5);
      multiPlayer.pause();
      multiPlayer.fadeTo(5);

      expect(player.playAndFadeIn).to.have.been.calledTwice;
    });

    it('plays and fades in new player directly if crossFade option is true', function() {
      var previousPlayer = new pageflow.AudioPlayer.Null();
      var nextPlayer = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({
        5: previousPlayer,
        6: nextPlayer
      });
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000, crossFade: true});
      var pendingPromise = new jQuery.Deferred();

      sinon.stub(previousPlayer, 'fadeOutAndPause').returns(pendingPromise);
      sinon.spy(nextPlayer, 'playAndFadeIn');

      multiPlayer.fadeTo(5);
      multiPlayer.fadeTo(6);

      expect(nextPlayer.playAndFadeIn).to.have.been.calledWith(1000);
    });
  });

  describe('#play', function() {
    it('plays new player', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});

      sinon.spy(player, 'play');

      multiPlayer.play(5);

      expect(player.play).to.have.been.called;
    });

    it('fades and pauses previous player', function() {
      var previousPlayer = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({
        5: previousPlayer,
        6: new pageflow.AudioPlayer.Null()
      });
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});

      sinon.spy(previousPlayer, 'fadeOutAndPause');

      multiPlayer.play(5);
      multiPlayer.play(6);

      expect(previousPlayer.fadeOutAndPause).to.have.been.calledWith(1000);
    });

    it('does not interrupt playback when playing  same audio file', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000
      });

      sinon.spy(player, 'play');
      sinon.stub(player, 'paused').returns(false);

      multiPlayer.play(5);
      multiPlayer.play(5);

      expect(player.play).to.have.been.calledOnce;
    });

    it('rewinds 0 if playFromBeginning option is true', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000,
        playFromBeginning: true
      });

      sinon.spy(player, 'rewind');

      multiPlayer.play(5);

      expect(player.rewind).to.have.been.called;
    });

    it('restarts same audio file if playFromBeginning option is true', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000,
        playFromBeginning: true
      });

      sinon.spy(player, 'play');

      multiPlayer.play(5);
      multiPlayer.play(5);

      expect(player.play).to.have.been.calledTwice;
    });

    it('rewinds if rewindOnChange option is true', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000,
        rewindOnChange: true
      });

      sinon.spy(player, 'rewind');

      multiPlayer.play(5);

      expect(player.rewind).to.have.been.called;
    });

    it('does not interrupt when playing same audio file when rewindOnChange option is true', function() {
      var player = new pageflow.AudioPlayer.Null();
      var pool = fakePlayerPool({5: player});
      var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {
        fadeDuration: 1000,
        rewindOnChange: true
      });

      sinon.spy(player, 'play');
      sinon.stub(player, 'paused').returns(false);

      multiPlayer.play(5);
      multiPlayer.play(5);

      expect(player.play).to.have.been.calledOnce;
    });
  });

  it('emits play event on play', function() {
    var player = new pageflow.AudioPlayer.Null();
    var pool = fakePlayerPool({5: player});
    var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});
    var handler = sinon.spy();

    multiPlayer.on('play', handler);
    multiPlayer.play(5);
    player.trigger('play');

    expect(handler).to.have.been.calledWith({audioFileId: 5});
  });

  it('emits ended event when player ends', function() {
    var player = new pageflow.AudioPlayer.Null();
    var pool = fakePlayerPool({5: player});
    var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});
    var handler = sinon.spy();

    multiPlayer.on('ended', handler);
    multiPlayer.play(5);
    player.trigger('ended');

    expect(handler).to.have.been.calledWith({audioFileId: 5});
  });

  it('does not emit ended event if player is no longer current player', function() {
    var player = new pageflow.AudioPlayer.Null();
    var pool = fakePlayerPool({
      5: player,
      6: new pageflow.AudioPlayer.Null()
    });
    var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});
    var handler = sinon.spy();

    multiPlayer.on('ended', handler);
    multiPlayer.play(5);
    multiPlayer.play(6);
    player.trigger('ended');

    expect(handler).not.to.have.been.called;
  });

  it('propagates playfailed event', function() {
    var player = new pageflow.AudioPlayer.Null();
    var pool = fakePlayerPool({5: player});
    var multiPlayer = new pageflow.Audio.MultiPlayer(pool, {fadeDuration: 1000});
    var handler = sinon.spy();

    multiPlayer.on('playfailed', handler);
    multiPlayer.play(5);
    player.trigger('playfailed');

    expect(handler).to.have.been.called;
  });

  function fakePlayerPool(players) {
    return {
      get: function(id) {
        return players[id];
      }
    };
  }
});
