
document.getElementById('search').addEventListener('input', function() {
    let filter = this.value.toLowerCase();
    let scores = document.querySelectorAll('#score-list .score-card');
    scores.forEach(score => {
        let text = score.textContent.toLowerCase();
        score.style.display = text.includes(filter) ? '' : 'none';
    });
});
