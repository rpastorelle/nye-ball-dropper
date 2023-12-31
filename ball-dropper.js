function ballDropApp() {
  return {
      currentNode: 0, // Start at the top
      isMidnight: false,
      useAltClues: false,
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
      dropBall: function(nye=false) {

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0 for January, 11 for December
        const currentDay = currentDate.getDate();

        let targetNode = 0;
        if (nye || (currentMonth === 11 && currentDay === 31)) {

          // It's NYE!
          const currentHour = currentDate.getHours();
          if (currentHour === 0) { // Midnight
              targetNode = 12;
          } else if (currentHour >= 13 && currentHour <= 23) { // 1 PM (13) to 11 PM (23)
              targetNode = currentHour - 12;
          } else {
              // It's before 1 PM
              targetNode = 0;
          }

        } else if (currentYear >= 2024) {
          targetNode = 12;
        }

        console.log("@@@ dropBall", currentDate, "with ", {
          currentYear,
          currentMonth,
          currentDay,
          targetNode,
        });

        this.moveToNode(targetNode);

      },
      init() {
        const queryParams = new URLSearchParams(window.location.search);
        const nodeNumber = queryParams.get('n');
        const nye = queryParams.get('nye') !== null;
        const clues = queryParams.get('clue') !== null;

        this.useAltClues = queryParams.has('alt');

        const moveBall = () => {
          if (nodeNumber !== null) {
            // Set to 'n' param, if exists
            this.moveToNode(parseInt(nodeNumber, 10));
          } else {
            this.dropBall(nye);
          }
        };

        // Wait 1 second before dropping ball
        setTimeout(moveBall, 1000);

        if (clues) {
          // Show clues title if 'clue' param exists
          document.querySelectorAll('.title').forEach((el) => {
            el.classList.add('revealed');
          });
        }

        window.moveToNextNode = this.moveToNextNode.bind(this);
        window.moveToNode = this.moveToNode.bind(this);
      }
  }
}
