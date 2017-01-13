$(document)
  .ready(function() {
    $('.star.rating').rating();
    $('.card .dimmer').dimmer({ on: 'hover' });
    $('.ui.card .ui.more.button').click(function(ev) {
      console.log($(ev.target).attr('data-target'));
      $($(ev.target).attr('data-target')).modal('show');
    });
  });