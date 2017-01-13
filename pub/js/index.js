$(document)
  .ready(function() {
    $('.star.rating').rating();
    $('.card .dimmer').dimmer({ on: 'hover' });
    $('.ui.card .ui.more.button').click(function(ev) {
      $($(ev.currentTarget).attr('data-target')).modal('show');
    });
  });