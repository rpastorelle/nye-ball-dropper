function ballDropApp() {
  return {
      currentNode: 0, // Start at the top
      isMidnight: false,
      get ballPosition() {
        const positions = {
            0: '0%',
            1: '6%', 2: '13%', 3: '21%', 4: '29%', 5: '37%',
            6: '45%', 7: '53%', 8: '61%', 9: '69%', 10: '77%',
            11: '85%', 12: '93%'
        };
        return `calc(${positions[this.currentNode]} - 24px)`;
      },
      moveToNextNode() {
        if (this.currentNode < 12) {
            this.currentNode += 1;
        }
      },
      moveToNode(targetNode) {
        const delay = 1200;
        const step = () => {
          if (this.currentNode < targetNode) {
              this.currentNode += 1;
              setTimeout(step, delay); // Move forward
          } else if (this.currentNode > targetNode) {
              this.currentNode -= 1;
              setTimeout(step, delay); // Move backward
          }
          if (this.currentNode == 12) {
              this.isMidnight = true;
          }
        };

        if (targetNode >= 0 && targetNode <= 12) {
            step();
        } else {
            console.error("Invalid node number:", targetNode);
        }

      },
      // Function to simulate ball drop and reveal clues
      dropBall: function() {

        const currentHour = new Date().getHours(); // Get current hour (0-23)
        let targetNode;

        if (currentHour === 0) { // Midnight
            targetNode = 12;
        } else if (currentHour >= 13 && currentHour <= 23) { // 1 PM (13) to 11 PM (23)
            targetNode = currentHour - 12;
        } else {
            // It's before 1 PM, so no movement required
            return;
        }

        this.moveToNode(targetNode);

      },
      init() {
        const queryParams = new URLSearchParams(window.location.search);
        const nodeNumber = queryParams.get('n');

        const moveBall = () => {
          if (nodeNumber !== null) {
            // Set to 'n' param, if exists
            this.moveToNode(parseInt(nodeNumber, 10));
          } else {
            this.dropBall();
          }
        };

        // Wait 1 second before dropping ball
        setTimeout(moveBall, 1000);

        window.moveToNextNode = this.moveToNextNode.bind(this);
        window.moveToNode = this.moveToNode.bind(this);
      }
  }
}
