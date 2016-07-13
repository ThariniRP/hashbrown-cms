'use strict';

let Pane = require('./Pane');

class ConnectionPane extends Pane {
    /**
     * Event: Click new connection
     */
    static onClickNewConnection() {
        let navbar = ViewHelper.get('NavbarMain');

        apiCall('post', 'connections/new')
        .then((newConnection) => {
            reloadResource('connections')
            .then(() => {
                navbar.reload();

                location.hash = '/connections/' + newConnection.id;
            });
        })
        .catch(navbar.onError);
    }

    /**
     * Event: On click remove connection
     */
    static onClickRemoveConnection() {
        let navbar = ViewHelper.get('NavbarMain');
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
        function onSuccess() {
            debug.log('Removed connection with alias "' + id + '"', navbar); 
        
            reloadResource('connections')
            .then(function() {
                navbar.reload();
                
                // Cancel the ConnectionEditor view if it was displaying the deleted connection
                if(location.hash == '#/connections/' + id) {
                    location.hash = '/connections/';
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete content',
                body: 'Are you sure you want to remove the connection "' + name + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: function() {
                        apiCall('delete', 'connections/' + id)
                        .then(onSuccess)
                        .catch(navbar.onError);
                    }
                }
            ]
        });
    }

    /**
     * Gets render settings
     *
     * @returns {Object} settings
     */
    static getRenderSettings() {
        return {
            label: 'Connections',
            route: '/connections/',
            icon: 'exchange',
            items: resources.connections,

            // Item context menu
            itemContextMenu: {
                'This connection': '---',
                'Copy id': () => { this.onClickCopyItemId(); },
                'Remove': () => { this.onClickRemoveConnection(); }
            },

            // General context menu
            paneContextMenu: {
                'General': '---',
                'New connection': () => { this.onClickNewConnection(); }
            }
        };
    }
}

module.exports = ConnectionPane;
